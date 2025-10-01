import uuid

from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from client.permissions import check_preparer_or_approver_permission, check_pwc_member
from core.views import BaseListView, BaseModelViewSet
from navigator.helpers import (
    get_grouped_legislation_attention_points,
    get_user_client_legislations,
    upload_and_process_legislation_file,
)
from navigator.models import (
    AttentionPoint,
    Legislation,
    RegistrationRequirement,
    RegulatoryRequirement,
    ReportingRequirement,
)
from navigator.serializers import (
    AttentionPointCreateSerializer,
    AttentionPointListSerializer,
    AttentionPointSerializer,
    AttentionPointUpdateSerializer,
    FileUploadSerializer,
    FilterListSerializer,
    LegislationSerializer,
    RegistrationRequirementSerializer,
    RegulatoryRequirementSerializer,
    ReportingRequirementSerializer,
    RoleContentSerializer,
)
from profiles.models import JobRole

from .permissions import CanChangePreparationState

# pylint: disable=R0901, R0914


@extend_schema(tags=["Legislation"])
class LegislationViewSet(BaseModelViewSet):

    serializer_class = LegislationSerializer
    permission_classes = [permissions.IsAuthenticated, CanChangePreparationState]

    def get_queryset(self):
        profile = self.request.user

        if check_pwc_member(profile):
            return Legislation.objects.all()

        return Legislation.objects.filter(preparation_state=Legislation.PreparationState.APPROVED)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            custom_response = {"results": serializer.data, "errors": []}
            return Response(custom_response, status=status.HTTP_201_CREATED)
        return Response({"results": None, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            custom_response = {"results": serializer.data, "errors": []}
            return Response(custom_response, status=status.HTTP_200_OK)
        return Response({"results": None, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        """List legislation with custom response format"""
        user = self.request.user
        if check_preparer_or_approver_permission(user):
            queryset = self.get_queryset()
        else:
            queryset = get_user_client_legislations(user)
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """Get legislation with custom response format"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=False, url_path="filters")
    def get_filters(self, request):
        results = {"results": {}, "errors": []}
        try:
            filter_data = FilterListSerializer().initial_data
            results["results"] = filter_data
        except (AttributeError, TypeError) as e:
            results["errors"] = f"Could not retrieve filter fields: {str(e)}"
        return Response(results, status=status.HTTP_200_OK)

    @action(detail=False, methods=["POST"], url_path="upload-legislation")
    def upload_legislation(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        return upload_and_process_legislation_file(serializer, self.request)


@extend_schema(tags=["Legislation"])
class LegislationAttentionPointListView(BaseListView):
    serializer_class = AttentionPointListSerializer
    queryset = AttentionPoint.objects.all()

    def get_queryset(self):
        legislation_id = self.kwargs.get("legislation_id")
        return AttentionPoint.objects.filter(legislation__identifier=legislation_id)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)


@extend_schema(tags=["Legislation"])
class AttentionPointView(BaseModelViewSet):

    queryset = AttentionPoint.objects.select_related("legislation").prefetch_related("job_role_list").all()
    serializer_class = AttentionPointSerializer

    def get_serializer_class(self):
        if self.action == "partial_update":
            return AttentionPointUpdateSerializer
        return AttentionPointSerializer

    def is_valid_uuid(self, uuid_str):
        try:
            uuid.UUID(uuid_str)
            return True
        except ValueError:
            return False

    @action(detail=True, methods=["PATCH"], url_path="custom-update")
    def custom_update(self, request, *args, **kwargs):
        attention_point: AttentionPoint = self.get_object()
        note = request.data.get("note", None)
        job_role_list = request.data.get("job_role_list", None)
        errors = []

        if note is not None:
            attention_point.note = note

        if job_role_list is not None:
            # Validate the UUIDs in job_role_list
            invalid_identifiers = [identifier for identifier in job_role_list if not self.is_valid_uuid(identifier)]

            if invalid_identifiers:
                errors.append(f"The following are not valid UUIDs: {', '.join(invalid_identifiers)}")

            if not errors:
                job_roles = JobRole.objects.filter(identifier__in=job_role_list)
                if job_roles.count() != len(job_role_list):
                    errors.append("One or more JobRole identifiers are invalid.")
                else:
                    attention_point.job_role_list.set(job_roles)

        attention_point.save()
        serializer = self.get_serializer(attention_point)

        if not errors:
            attention_point.save()
            serializer = self.get_serializer(attention_point)
            response_data = {"results": serializer.data, "errors": []}
            return Response(response_data, status=status.HTTP_200_OK)

        return Response({"results": {}, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Legislation"])
class RoleContentView(BaseModelViewSet):
    serializer_class = RoleContentSerializer
    queryset = AttentionPoint.objects.select_related("legislation").prefetch_related("job_role_list").all()

    def get_serializer_class(self):
        if self.action == "create":
            return AttentionPointCreateSerializer
        return RoleContentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response_data = {"results": serializer.data, "errors": []}
            return Response(response_data, status=status.HTTP_201_CREATED)
        response_data = {"results": [], "errors": serializer.errors}
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["POST"], url_path="select")
    def select_by_ids(self, request, *args, **kwargs):
        selectors = request.data.get("selectors", {})
        job_role_id_list = request.data.get("job_role_list", [])
        user = self.request.user

        grouped_result, errors = get_grouped_legislation_attention_points(user, selectors, job_role_id_list)

        if not grouped_result:
            response_data = {"results": [], "errors": errors}
            return Response(response_data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(grouped_result, many=True)
        response_data = {"results": serializer.data, "errors": errors}
        return Response(response_data, status=status.HTTP_200_OK)


@extend_schema(tags=["Reporting Requirement"])
class ReportingRequirementViewSet(BaseModelViewSet):

    serializer_class = ReportingRequirementSerializer
    permission_classes = [permissions.IsAuthenticated, CanChangePreparationState]
    queryset = ReportingRequirement.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(tags=["Registration Requirement"])
class RegistrationRequirementViewSet(BaseModelViewSet):

    serializer_class = RegistrationRequirementSerializer
    permission_classes = [permissions.IsAuthenticated, CanChangePreparationState]
    queryset = RegistrationRequirement.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(tags=["Regulatory Requirement"])
class RegulatoryRequirementViewSet(BaseModelViewSet):

    serializer_class = RegulatoryRequirementSerializer
    permission_classes = [permissions.IsAuthenticated, CanChangePreparationState]
    queryset = RegulatoryRequirement.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
