# pylint: disable=R0901
from django.db.models import Q
from django.db.utils import DatabaseError
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from client.permissions import check_preparer_or_approver_permission
from core.views import BaseModelViewSet
from profiles.models import JobRole, Profile
from profiles.serializers import JobRoleSerializer, ProfileSearchSerializer, ProfileSerializer


@extend_schema(tags=["Profile"])
class ProfileViewSet(BaseModelViewSet):
    serializer_class = ProfileSerializer
    lookup_field = "identifier"

    def perform_create(self, serializer):
        """Create new profile"""
        serializer.save()

    def get_queryset(self):
        user = self.request.user
        return Profile.objects.filter(pk=user.pk)

    def list(self, request, *args, **kwargs):
        """List profiles with custom response format"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["POST"], url_path="search-pwc")
    def search_pwc(self, request, *args, **kwargs):
        """
        Allows approver admin user to search for pwc members
        """
        if not check_preparer_or_approver_permission(self.request.user):
            raise PermissionDenied("You do not have permission to search PwC users.")

        response_data = {"results": [], "errors": []}

        serializer = ProfileSearchSerializer(data=request.data)
        if not serializer.is_valid():
            response_data["errors"].append(serializer.errors)
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        search_term = serializer.validated_data["search_term"]

        if not search_term:
            response_data["errors"].append("Search term is required.")
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        try:
            profiles = Profile.objects.filter(
                (
                    Q(email__icontains=search_term)
                    | Q(first_name__icontains=search_term)
                    | Q(last_name__icontains=search_term)
                )
                & Q(email__iendswith="@pwc.com")
            )

            if not profiles.exists():
                response_data["errors"].append("No profiles found matching the search criteria.")
                return Response(response_data, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(profiles, many=True)
            response_data["results"] = serializer.data

        except DatabaseError as e:
            response_data["errors"].append(f"Database error: {str(e)}")
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(response_data, status=status.HTTP_200_OK)


@extend_schema(tags=["JobRole"])
class JobRoleViewSet(BaseModelViewSet):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer

    def get_serializer_class(self):
        """Return the serializer_class for the request"""
        if self.action in ["list", "info"]:
            return JobRoleSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        """List job roles with custom response format"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)
