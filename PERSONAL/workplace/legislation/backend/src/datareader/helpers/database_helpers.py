# pylint: disable=R0912, R0914, R0915,
import logging
import math
from datetime import date, datetime
from typing import Dict, Tuple

import pandas as pd
from django.db import DatabaseError
from django.db import IntegrityError as DjangoIntegrityError
from django.db import transaction
from MySQLdb import IntegrityError

from datareader.helpers.excel_helpers import remap_record_to_legislation_fields
from datareader.helpers.validation_helpers import process_dropdown_field
from datareader.models import DataSource
from navigator.models import Legislation, RegistrationRequirement, RegulatoryRequirement, ReportingRequirement
from navigator.utils import add_many_to_many_relations


def create_legislation_database_entries(  # pylint: disable=inconsistent-return-statements
    record: Dict,
    dfs: Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame],
    obj: DataSource,
):
    df_registration, df_regulatory, df_reporting, df_role_content = dfs
    is_in_effect = False
    status = "PENDING"
    if record["*In effect"] == "Yes":
        is_in_effect = True
        status = "IN EFFECT"
    abbreviation = record["*Unique Identifier Code"]
    try:
        related_data = {
            "type": process_dropdown_field(record.pop("*Type of legislation", "")),
            "topic": process_dropdown_field(record.pop("*Topic", "")),
            "issuing_jurisdiction": process_dropdown_field(record.pop("*Issuing jurisdiction", "")),
            "geographical_scope": process_dropdown_field(record.pop("*Geographical scope", "")),
            "product_service": process_dropdown_field(record.pop("*Relevant product (group) or services", "")),
            "non_compliance_consequence": process_dropdown_field(record.pop("*Consequences of non-compliance", "")),
        }

        with transaction.atomic():
            legislation_data = remap_record_to_legislation_fields(record, status, is_in_effect, obj.owner)
            model_instance, _ = Legislation.objects.get_or_create(**legislation_data)
            add_many_to_many_relations(model_instance, related_data)

            df_registration = df_registration[df_registration["*General description"] != 0]
            registration_requirement_list = df_registration[
                df_registration["*Legislation code"] == abbreviation
            ].to_dict(orient="records")

            db_registration_requirement = []
            for entry in registration_requirement_list:
                registration_requirement, _ = RegistrationRequirement.objects.get_or_create(
                    description=entry["*General description"],
                    responsible_authority=entry["*Responsible authority"],
                    trigger=entry["*Activities that trigger requirements"],
                    responsible_party=entry["*Responsible party"],
                    data_elements=entry["*Data elements required"],
                    payment_obligations=entry["*Payment obligations"],
                    deadline=entry["*Deadline"],
                    threshold=entry["*Threshold"],
                    sanctions=entry["*Sanctions"],
                    exemptions=entry["*Exemptions"],
                    legislation=model_instance,
                )
                db_registration_requirement.append(registration_requirement)
            df_reporting = df_reporting[df_reporting["General description"] != 0]
            reporting_requirement_list = df_reporting[df_reporting["*Legislation code"] == abbreviation].to_dict(
                orient="records"
            )

            db_reporting_requirement = []
            for entry in reporting_requirement_list:
                reporting_requirement, _ = ReportingRequirement.objects.get_or_create(
                    description=entry["General description"],
                    responsible_authority=entry["Responsible authority"],
                    trigger=entry["Activities that trigger requirements"],
                    responsible_party=entry["Responsible party"],
                    data_elements=entry["Data elements for reporting"],
                    language=entry["Language of reporting"],
                    frequency=entry["Frequency of reporting"],
                    deadline=entry["Deadlines"],
                    way_of_submission=entry["Way of submitting"],
                    payment_obligations=entry["Payment obligations and rates"],
                    retainment_of_records=entry["Retainment of records"],
                    refund_possibilities=entry["Refund possibilities"],
                    threshold=entry["Thresholds"],
                    sanctions=entry["Sanctions"],
                    exemptions=entry["Exemptions"],
                    legislation=model_instance,
                )

                db_reporting_requirement.append(reporting_requirement)
            df_regulatory = df_regulatory[df_regulatory["General description"] != 0]
            regulatory_requirement_list = df_regulatory[df_regulatory["*Legislation code"] == abbreviation].to_dict(
                orient="records"
            )

            db_regulatory_requirement = []
            for entry in regulatory_requirement_list:
                regulatory_requirement, _ = RegulatoryRequirement.objects.get_or_create(
                    description=entry["General description"],
                    responsible_authority=entry["Responsible authority"],
                    trigger=entry["Activities that trigger requirements"],
                    responsible_party=entry["Responsible party"],
                    key_actions=entry["Key actions for compliance"],
                    deadline=entry["Deadlines"],
                    threshold=entry["Thresholds"],
                    sanctions=entry["Sanctions"],
                    exemptions=entry["Exemptions"],
                    legislation=model_instance,
                )
                db_regulatory_requirement.append(regulatory_requirement)

            return model_instance

    except IntegrityError as e:
        if e.args[0] == 1062:  # MySQL Duplicate Entry error code
            handle_duplicate_legislation_entry(record, related_data, status, is_in_effect, obj.owner)
        else:
            raise e  # Rethrow the exception if it's not the duplicate entry error
    except DjangoIntegrityError as e:
        if "Duplicate entry" in str(e):
            handle_duplicate_legislation_entry(record, related_data, status, is_in_effect, obj.owner)
        else:
            logging.error("DjangoIntegrityError: %s", e)
            raise e
    except DatabaseError as e:
        logging.error("DatabaseError: %s", e)
    except Exception as e:
        # logging.info(traceback.format_exc())
        logging.error("An unexpected error occurred at database entry: %s", e)
        raise e


def handle_duplicate_legislation_entry(
    record,
    related_data,
    status,
    is_in_effect,
    owner,
):
    """
    If the record already exists, handle the request as an update.
    """
    legislation_data = remap_record_to_legislation_fields(record, status, is_in_effect, owner)
    with transaction.atomic():
        model_instance = Legislation.objects.get(name_local=legislation_data["name_local"])
        fields_changed = False

        for attr, value in legislation_data.items():
            current_value = getattr(model_instance, attr)
            # Check if the field is a date field and if so, parse the string to a date object
            if isinstance(current_value, date) and isinstance(value, str):
                try:
                    # Parse the string to a date object
                    value = datetime.strptime(value, "%Y-%m-%d").date()
                except ValueError:
                    # Handle the exception if the date format is incorrect
                    print(f"Invalid date format for field '{attr}': {value}")

            # Data read as nan can be read as float and cause a comparison error
            # The following check will ignore incoming value that is nan
            if current_value != value:
                if isinstance(value, float):
                    if math.isnan(value):
                        continue
                else:
                    setattr(model_instance, attr, value)
                    fields_changed = True

            if fields_changed:
                model_instance.save()

        for field in related_data:
            getattr(model_instance, field).clear()

        add_many_to_many_relations(model_instance, related_data)
