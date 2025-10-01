import base64
import uuid

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from client.permissions import check_preparer_or_approver_permission
from core.validators import validate_image_extension
from navigator.models import Legislation
from navigator.serializers import (
    GeographicalScopeSerializer,
    IssuingJurisdictionSerializer,
    LegislationSerializer,
    LegislationTypeSerializer,
    ProductServiceSerializer,
    TopicSerializer,
)
from profiles.models import JobRole, Profile
from profiles.serializers import JobRoleSerializer, ProfileSerializer

from .models import Client, ClientLegislation, ClientLegislationJobRole


class ClientIDSerializer(serializers.Serializer):  # pylint: disable=W0223
    client_identifier = serializers.UUIDField()


class ClientLegislationStatusSerializer(serializers.Serializer):  # pylint: disable=W0223
    client_identifier = serializers.UUIDField()
    legislation_identifier = serializers.UUIDField()
    is_published = serializers.BooleanField()


class LegislationApprovalRequestSerializer(serializers.Serializer):  # pylint: disable=W0223
    client_identifier = serializers.UUIDField()
    legislation_identifier_list = serializers.ListField(child=serializers.UUIDField())


class ClientLegislationSerializer(serializers.ModelSerializer):
    legislation = LegislationSerializer()
    is_published = serializers.BooleanField()
    publication_date = serializers.DateTimeField()

    class Meta:
        model = ClientLegislation
        fields = [
            "legislation",
            "is_published",
            "publication_date",
            "created_at",
        ]


class ClientSerializer(serializers.ModelSerializer):
    # For read operations: Full Profile representation
    team_member_list = ProfileSerializer(
        source="team_members",
        many=True,
        read_only=True,
        context={"exclude_client_fields": True},
    )
    client_member_list = ProfileSerializer(
        source="client_members",
        many=True,
        read_only=True,
        context={"exclude_client_fields": True},
    )
    project_owner_list = ProfileSerializer(
        source="project_owner_list",
        many=True,
        read_only=True,
        context={"exclude_client_fields": True},
    )

    # For write operations: UUIDs for team_member_list, client_member_list, and project_owner_list
    team_member_list = serializers.ListField(
        child=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
    )
    client_member_list = serializers.ListField(
        child=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
    )
    project_owner_list = serializers.ListField(
        child=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
    )

    logo = serializers.FileField(write_only=True, validators=[validate_image_extension], required=False)

    class Meta:
        model = Client
        exclude = ["id"]
        read_only_fields = ["id"]

    def to_representation(self, instance: Client):
        representation = super().to_representation(instance)
        request = self.context.get("request", None)

        basic_fields = {
            "created_at": representation.get("created_at"),
            "updated_at": representation.get("updated_at"),
            "name": representation.get("name"),
            "description": representation.get("description"),
            "identifier": representation.get("identifier"),
            "is_published": representation.get("is_published"),
            "legislation_count": ClientLegislation.objects.filter(client=instance).count(),
        }

        # Check if the request is a list (multiple items) or detail (single item)
        if request and request.parser_context["view"].action == "list":
            # If this is a list request, return only the basic fields
            return basic_fields

        if instance.logo:
            representation["logo"] = base64.b64encode(instance.logo).decode("utf-8")
        else:
            representation["logo"] = None

        representation["team_member_list"] = ProfileSerializer(
            instance.team_members.all(),
            many=True,
            context={"exclude_client_fields": True},
        ).data
        representation["client_member_list"] = ProfileSerializer(
            instance.client_members.all(),
            many=True,
            context={"exclude_client_fields": True},
        ).data
        representation["project_owner_list"] = ProfileSerializer(
            instance.project_owner_list.all(),
            many=True,
            context={"exclude_client_fields": True},
        ).data

        # Pop the model fields and so only serializer fields are shown
        representation.pop("team_members", None)
        representation.pop("client_members", None)

        legislation_count = ClientLegislation.objects.filter(client=instance).count()
        representation["legislation_count"] = legislation_count

        if request:
            user = request.user
            if user in instance.client_members.all():
                # If user is linked to client_members, do not show PwC members to them
                representation.pop("team_member_list", None)
                representation.pop("project_owner_list", None)

        return representation

    def create(self, validated_data):
        user = self.context["request"].user
        if not check_preparer_or_approver_permission(user):
            raise PermissionDenied("You do not have permission to create a new client.")

        logo_file = validated_data.pop("logo", None)
        if logo_file:
            validate_image_extension(logo_file)
            validated_data["logo"] = logo_file.read()

        team_member_uuids = validated_data.pop("team_member_list", [])
        client_member_uuids = validated_data.pop("client_member_list", [])
        project_owner_uuids = validated_data.pop("project_owner_list", [])

        validated_data["created_by"] = user
        client = Client.objects.create(**validated_data)

        team_members = [user]

        if team_member_uuids:
            additional_team_members = Profile.objects.filter(identifier__in=team_member_uuids)
            team_members.extend(additional_team_members)

        client.team_members.set(team_members)

        if client_member_uuids:
            client_members = Profile.objects.filter(identifier__in=client_member_uuids)
            client.client_members.set(client_members)

        if project_owner_uuids:
            project_owners = Profile.objects.filter(identifier__in=project_owner_uuids)
            client.project_owner_list.set(project_owners)
            client.team_members.add(*project_owners)

        client.save()
        return client

    def update(self, instance: Client, validated_data):
        user = self.context["request"].user
        if not check_preparer_or_approver_permission(user):
            raise PermissionDenied("You do not have permission to update a client.")

        logo_file = validated_data.pop("logo", None)
        if logo_file:
            validate_image_extension(logo_file)
            instance.logo = logo_file.read()

        instance.save()

        team_member_uuids = validated_data.pop("team_member_list", [])
        client_member_uuids = validated_data.pop("client_member_list", [])
        project_owner_uuids = validated_data.pop("project_owner_list", [])

        if team_member_uuids:
            team_members = Profile.objects.filter(identifier__in=team_member_uuids)
            instance.team_members.set(team_members)

        if client_member_uuids:
            client_members = Profile.objects.filter(identifier__in=client_member_uuids)
            instance.client_members.set(client_members)

        if project_owner_uuids:
            project_owners = Profile.objects.filter(identifier__in=project_owner_uuids)
            instance.project_owner_list.set(project_owners)
            instance.team_members.add(*project_owners)

        if "is_published" in validated_data:
            if user not in instance.project_owner_list.all():
                raise PermissionDenied("You do not have permission change publish status of this client.")

            instance.is_published = validated_data.pop("is_published")
            matching_profiles = Profile.objects.filter(email__iendswith="@" + instance.domain)
            instance.client_members.set(matching_profiles)

        # Update any other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def get_logo(self, instance):
        if instance.logo:
            return base64.b64encode(instance.logo).decode("utf-8")
        return None


class ClientLegislationJobRoleSerializer(serializers.Serializer):  # pylint: disable=W0223
    client_identifier = serializers.UUIDField()
    legislation_identifier = serializers.UUIDField()
    job_role_identifier = serializers.UUIDField()
    note = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def create(self, validated_data):
        user = self.context["request"].user  # Get the current user (profile)

        if not check_preparer_or_approver_permission(user):
            raise PermissionDenied("You do not have permission to add a note to client legislation job role.")

        client = Client.objects.get(identifier=validated_data["client_identifier"])
        legislation = Legislation.objects.get(identifier=validated_data["legislation_identifier"])
        job_role = JobRole.objects.get(identifier=validated_data["job_role_identifier"])

        _, _ = ClientLegislationJobRole.objects.update_or_create(
            client=client,
            legislation=legislation,
            job_role=job_role,
            defaults={"note": validated_data.get("note", ""), "identifier": uuid.uuid4()},
        )
        return {
            "client_identifier": validated_data["client_identifier"],
            "legislation_identifier": validated_data["legislation_identifier"],
            "job_role_identifier": validated_data["job_role_identifier"],
            "note": validated_data.get("note", ""),
        }


def get_selected_filters(filtered_legislations):
    """
    Given a list of legislations, returns unique selected filters
    """
    unique_product_services = set()
    unique_geographical_scopes = set()
    unique_topics = set()
    unique_legislation_types = set()
    unique_issuing_jurisdictions = set()
    unique_job_roles = set()

    for legislation in filtered_legislations:
        unique_product_services.update(legislation.product_service.all())
        unique_geographical_scopes.update(legislation.geographical_scope.all())
        unique_topics.update(legislation.topic.all())
        unique_legislation_types.update(legislation.type.all())
        unique_issuing_jurisdictions.update(legislation.issuing_jurisdiction.all())

        # For job roles, use the LegislationJobRole intermediary model
        unique_job_roles.update(JobRole.objects.filter(legislationjobrole__legislation=legislation))

    filter_data = [
        {
            "name": "Product or service",
            "label": "product_service",
            "data": ProductServiceSerializer(unique_product_services, many=True).data,
        },
        {
            "name": "Geographical scope",
            "label": "geographical_scope",
            "data": GeographicalScopeSerializer(unique_geographical_scopes, many=True).data,
        },
        {"name": "Topic", "label": "topic", "data": TopicSerializer(unique_topics, many=True).data},
        {
            "name": "Legislation type",
            "label": "type",
            "data": LegislationTypeSerializer(unique_legislation_types, many=True).data,
        },
        {
            "name": "Issuing jurisdiction",
            "label": "issuing_jurisdiction",
            "data": IssuingJurisdictionSerializer(unique_issuing_jurisdictions, many=True).data,
        },
        {
            "name": "Job roles",
            "label": "job_roles",
            "data": JobRoleSerializer(unique_job_roles, many=True).data,
        },
    ]

    return filter_data
