import logging
import uuid
from collections import defaultdict
from typing import List

import pandas as pd
from django.db import IntegrityError
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response

from client.models import Client, ClientLegislation
from client.permissions import check_preparer_or_approver_permission
from datareader.models import DataImportLog, DataSource
from datareader.tasks import process_legislation_excel
from navigator.models import AttentionPoint, Legislation
from navigator.serializers import LegislationSerializer
from navigator.utils import is_uuid
from profiles.serializers import JobRoleSerializer


def upload_and_process_legislation_file(serializer, request):
    response_data = {"results": [], "errors": []}

    if not serializer.is_valid():
        response_data["errors"].append({"detail": "Invalid data.", "error": serializer.errors})
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    uploaded_file = serializer.validated_data["file"]
    name = serializer.validated_data.get("name", uploaded_file.name)

    obj = DataSource(
        name=name,
        owner=request.user,
        file=uploaded_file,
        file_type=DataSource.FileType.LEGISLATION.value,
    )

    try:
        obj.save()
        _created, _existing = process_legislation_excel(obj)
        legislation_list: List[Legislation] = _created
        existing_legislation_list = _existing
        unsuccessful_logs = DataImportLog.objects.filter(data_source=obj, level=DataImportLog.Level.ERROR)

        if not unsuccessful_logs.exists():
            response_data["results"].append(
                {
                    "detail": "File uploaded and processed successfully.",
                    "name": name,
                    "file": uploaded_file.name,
                    "legislation_list": LegislationSerializer(legislation_list, many=True).data,
                    "existing_legislation_list": existing_legislation_list,
                }
            )
            return Response(response_data, status=status.HTTP_201_CREATED)

        for log in unsuccessful_logs:
            if "Missing column" in log.message:
                response_data["errors"].append({"detail": "Missing column.", "message": log.message})
            elif "data type" in log.message:
                response_data["errors"].append({"detail": "Wrong data type.", "message": log.message})
            elif "Required sheets missing" in log.message:
                response_data["errors"].append({"detail": "Required sheets missing.", "message": log.message})
            else:
                response_data["errors"].append({"detail": "Error in processing file", "message": log.message})

    except (
        AttributeError,
        KeyError,
        ValueError,
        TypeError,
        IntegrityError,
        FileNotFoundError,
        pd.errors.EmptyDataError,
        pd.errors.ParserError,
    ) as specific_error:
        error_detail = handle_specific_error(specific_error, name)
        response_data["errors"].append(error_detail)
        return Response(response_data, status=error_detail["status"])

    except Exception as e:  # pylint: disable=broad-exception-caught
        logging.error("An unexpected error occurred during legislation upload: %s", str(e))
        error_detail = handle_specific_error(e, name)
        response_data["errors"].append(error_detail)
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    # If no specific return was hit, ensure we return something
    response_data["errors"].append({"detail": "An unexpected situation occurred."})
    return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


def handle_specific_error(error, name):
    response = {
        "detail": "An unexpected error occurred.",
        "error": "Please refresh the page and try again.",
        "status": status.HTTP_400_BAD_REQUEST,
        # "traceback": traceback.format_exc(),
    }

    if isinstance(error, IntegrityError):
        if "Duplicate entry" in str(error):
            logging.error("Integrity Error: %s", str(error))
            response.update(
                {
                    "detail": "Duplicate entry.",
                    "field": "name",
                    "message": f"The name '{name}' already exists.",
                    "status": status.HTTP_400_BAD_REQUEST,
                }
            )
        else:
            logging.error("Integrity Error: %s", str(error))
            response.update(
                {
                    "detail": "Database integrity error.",
                    "status": status.HTTP_400_BAD_REQUEST,
                }
            )

    elif isinstance(error, KeyError):
        response.update(
            {
                "detail": "Missing sheet, column, or value.",
                "status": status.HTTP_400_BAD_REQUEST,
            }
        )

    elif isinstance(error, ValueError):
        response.update(
            {
                "detail": "Incorrect value found in file.",
                "status": status.HTTP_400_BAD_REQUEST,
            }
        )

    elif isinstance(error, FileNotFoundError):
        logging.error("Error: %s. The file %s was not found.", error, name)
        response.update(
            {
                "detail": "File not found.",
                "status": status.HTTP_404_NOT_FOUND,
            }
        )

    elif isinstance(error, pd.errors.EmptyDataError):
        logging.error("Error: %s. The file %s is empty.", error, name)
        response.update(
            {
                "detail": "File is empty.",
                "status": status.HTTP_400_BAD_REQUEST,
            }
        )

    elif isinstance(error, pd.errors.ParserError):
        logging.error("Error: %s. There was a parsing error while reading %s.", error, name)
        response.update(
            {
                "detail": "Parsing error.",
                "status": status.HTTP_400_BAD_REQUEST,
            }
        )

    return response


def get_filtered_legislations(user, selectors, job_role_id_list):
    legislation_query = Q()

    for field, values in selectors.items():
        if isinstance(values, list):
            if all(is_uuid(value) for value in values):
                # Handle list of UUIDs
                uuid_objects = [uuid.UUID(str(value)) for value in values]
                legislation_query |= Q(**{f"{field}__identifier__in": uuid_objects})
            else:
                # Handle list of years
                if field == "effective_year":
                    year_queries = Q()
                    for year in values:
                        year_queries |= Q(**{"effective_date__year": int(year)})
                    legislation_query &= year_queries
                else:
                    # Handle other string lists directly
                    legislation_query &= Q(**{f"{field}__in": values})
        elif isinstance(values, str):
            # For categorical values
            legislation_query &= Q(**{f"{field}": values})

    # Only display published legislation for clients
    if not check_preparer_or_approver_permission(user):
        legislation_query &= Q(preparation_state=Legislation.PreparationState.APPROVED)

    # Add job_role_id_list to the query
    if job_role_id_list:
        job_role_objects = [uuid.UUID(id) for id in job_role_id_list]
        legislation_query &= Q(job_role_list__identifier__in=job_role_objects)

    return Legislation.objects.filter(legislation_query).distinct()


def get_grouped_legislation_attention_points(
    user,
    selectors,
    job_role_id_list,
):
    filtered_legislation = get_filtered_legislations(user, selectors, job_role_id_list)

    # If the user is not a preparer or approver, restrict legislations to those associated with the user's client
    if not check_preparer_or_approver_permission(user):
        client_legislations = get_user_client_legislations(user)
        if len(client_legislations) > 0:
            # Intersect the filtered legislations with the client's legislations
            filtered_legislation = filtered_legislation.filter(id__in=client_legislations.values_list("id", flat=True))
        else:
            # User is not associated with any client legislations; return empty result
            return [], []

    if not filtered_legislation.exists():
        return [], []  # second [] is for errors, in this case none

    filtered_attention_points = AttentionPoint.objects.filter(legislation__in=filtered_legislation).distinct()

    grouped_data = defaultdict(list)
    for attention_point in filtered_attention_points:
        legislation = attention_point.legislation
        attention_point_data = {
            "note": attention_point.note,
            "job_role_list": JobRoleSerializer(attention_point.job_role_list.all(), many=True).data,
        }
        grouped_data[legislation].append(attention_point_data)

    grouped_result = [
        {
            "legislation": LegislationSerializer(legislation).data,
            "attention_points": grouped_data.get(legislation, []),
        }
        for legislation in filtered_legislation
    ]

    return grouped_result, []  # second [] is for errors, in this case none


def get_user_client_legislations(user):
    # Get the clients the user is a member of
    clients = Client.objects.filter(client_members=user, is_published=True)
    if not clients.exists():
        return []  # User is not a member of any clients

    client_ids = clients.values_list("identifier", flat=True)

    # Get legislations approved for the Client
    client_legislation_associations = ClientLegislation.objects.filter(
        client__identifier__in=client_ids,
        is_published=True,
    )

    if not client_legislation_associations.exists():
        return []  # No legislations associated with the clients that are approved

    legislation_ids = client_legislation_associations.values_list("legislation__id", flat=True)
    return Legislation.objects.filter(id__in=legislation_ids)
