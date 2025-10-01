from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from client.models import Client, ClientLegislation
from client.permissions import (
    check_add_new_team_member,
    check_approver_permission,
    check_client_allocation,
    check_test_user,
    is_team_member,
)
from client.serializers import (
    ClientIDSerializer,
    ClientLegislationJobRoleSerializer,
    ClientLegislationSerializer,
    ClientLegislationStatusSerializer,
    ClientSerializer,
    LegislationApprovalRequestSerializer,
)
from core.views import BaseModelViewSet
from navigator.models import Legislation
from profiles.models import JobRole


@extend_schema(tags=["Client"])
class ManageClientViewSet(BaseModelViewSet):  # pylint: disable=too-many-ancestors

    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_serializer_context(self):
        # Ensuring the request is passed in the context
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not check_add_new_team_member(self.request):
            raise PermissionDenied("You do not have permission to update the team members.")
        serializer = self.serializer_class(
            instance,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            custom_response = {"results": serializer.data, "errors": []}
            return Response(custom_response, status=status.HTTP_200_OK)

        return Response({"results": None, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        custom_response = {"results": [], "errors": []}
        user = request.user
        check_test_user(user)
        check_client_allocation(user)
        queryset = self.queryset.filter(Q(team_members=user) | Q(client_members=user))
        serializer = self.get_serializer(queryset, many=True)
        custom_response = {"results": serializer.data, "errors": []}

        return Response(custom_response, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        custom_response = {"results": {}, "errors": []}
        user = request.user
        check_test_user(user)
        obj = get_object_or_404(
            self.queryset,
            identifier=kwargs.get("identifier"),
        )
        if not is_team_member(user, obj):
            raise PermissionDenied("You do not have permission to view this client.")
        serializer = self.serializer_class(obj, context=self.get_serializer_context())
        custom_response = {"results": serializer.data, "errors": []}

        return Response(custom_response, status=status.HTTP_200_OK)

    @action(detail=False, methods=["POST"], url_path="request-publication")
    def request_publication(self, request, *args, **kwargs):
        response_data = {"results": [], "errors": []}
        serializer = LegislationApprovalRequestSerializer(data=request.data, context={"request": request})

        if not serializer.is_valid():
            response_data["errors"] = serializer.errors
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = Client.objects.get(identifier=serializer.validated_data["client_identifier"])
        except Client.DoesNotExist:
            response_data["errors"].append({"client_identifier": "Client not found."})
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        legislations = Legislation.objects.filter(
            identifier__in=serializer.validated_data["legislation_identifier_list"]
        )
        missing_identifiers = set(serializer.validated_data["legislation_identifier_list"]) - set(
            legislations.values_list("identifier", flat=True)
        )

        if missing_identifiers:
            response_data["errors"].extend(
                [f"Legislation with identifier {missing_id} not found." for missing_id in missing_identifiers]
            )

        existing_legislation_identifiers = set(
            ClientLegislation.objects.filter(client=client, legislation__in=legislations).values_list(
                "legislation__identifier", flat=True
            )
        )

        client_legislation_to_create = []
        for legislation in legislations:
            if legislation.identifier in existing_legislation_identifiers:
                response_data["errors"].append(
                    f"Legislation {legislation.name_local} is already requested for this client."
                )
            else:
                client_legislation_to_create.append(
                    ClientLegislation(client=client, legislation=legislation, requested_by=self.request.user)
                )

        if client_legislation_to_create:
            for instance in client_legislation_to_create:
                instance.save()
            response_data["results"] = [
                {
                    "client_identifier": serializer.validated_data["client_identifier"],
                    "legislation_identifier": leg.legislation.identifier,
                }
                for leg in client_legislation_to_create
            ]

        return Response(
            response_data, status=status.HTTP_201_CREATED if response_data["results"] else status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=["POST"], url_path="publication-status")
    def publication_status(self, request, *args, **kwargs):
        response_data = {"results": None, "errors": [], "warnings": []}
        serializer = ClientIDSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            response_data["errors"] = serializer.errors
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the client by its identifier
        client_identifier = serializer.validated_data.get("client_identifier")

        try:
            client = Client.objects.get(identifier=client_identifier)
        except Client.DoesNotExist:
            response_data["errors"].append({"client_identifier": "Client not found."})
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        # Fetch all ClientLegislation records for the client
        client_legislation_records = ClientLegislation.objects.filter(client=client)

        if not client_legislation_records.exists():
            response_data["warnings"].append({"client_identifier": "No legislation found for this client."})
            return Response(response_data, status=status.HTTP_200_OK)

        # Serialize the ClientLegislation data
        results = ClientLegislationSerializer(client_legislation_records, many=True).data
        response_data["results"] = results

        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["POST"], url_path="update-client-legislation")
    def update_client_legislation(self, request, *args, **kwargs):
        if not check_approver_permission(self.request.user):
            raise PermissionDenied("You do not have permission to update this legislation for the client.")
        response_data = {"results": None, "errors": []}

        serializer = ClientLegislationStatusSerializer(data=request.data)
        if not serializer.is_valid():
            response_data["errors"] = serializer.errors
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        client_id = serializer.validated_data["client_identifier"]
        legislation_id = serializer.validated_data["legislation_identifier"]
        is_published = serializer.validated_data["is_published"]

        try:
            client_legislation = ClientLegislation.objects.get(
                client__identifier=client_id,
                legislation__identifier=legislation_id,
            )
        except ClientLegislation.DoesNotExist:
            response_data["errors"].append("No client legislation association found matching the search criteria.")
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        if is_published:
            client_legislation.publish(self.request.user)
        else:
            client_legislation.retract(self.request.user)

        response_data["results"] = "ok"
        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["POST"], url_path="add-note")
    def add_note(self, request, *args, **kwargs):
        """
        Add a note to the client-legislation-jobrole field. Appears as a special note
        for that client.
        """
        response_data = {"results": [], "errors": []}

        serializer = ClientLegislationJobRoleSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            response_data["errors"] = serializer.errors
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer.save()
            response_data["results"] = [
                {
                    "client_identifier": serializer.validated_data["client_identifier"],
                    "legislation_identifier": serializer.validated_data["legislation_identifier"],
                    "job_role_identifier": serializer.validated_data["job_role_identifier"],
                    "note": serializer.validated_data.get("note", ""),
                }
            ]
            return Response(response_data, status=status.HTTP_200_OK)

        except Client.DoesNotExist:
            response_data["errors"].append("Client not found.")
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        except Legislation.DoesNotExist:
            response_data["errors"].append("Legislation not found.")
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        except JobRole.DoesNotExist:
            response_data["errors"].append("Job role not found.")
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
