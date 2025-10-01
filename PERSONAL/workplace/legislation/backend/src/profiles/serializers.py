# pylint: disable=abstract-method
from django.db.models import Q
from rest_framework import serializers

from client.models import Client
from core.serializers import UUIDRelatedField
from profiles.models import JobRole, Profile


class JobRoleUUIDField(serializers.Field):
    def to_representation(self, value):
        return JobRoleSerializer(value, many=True).data

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError("Expected a list of UUIDs")
        job_roles = []
        for job_role_uuid in data:
            try:
                job_role = JobRole.objects.get(identifier=job_role_uuid)
                job_roles.append(job_role)
            except JobRole.DoesNotExist as e:
                raise serializers.ValidationError(
                    f"JobRole with identifier {job_role_uuid} does not exist. Details: {e}"
                )
        return job_roles


class JobRoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobRole
        fields = ["identifier", "name"]
        read_only_fields = ["id"]


class ProfileIdentifierField(serializers.RelatedField):
    def to_representation(self, value):
        # How the field is represented when serialized (e.g., in responses)
        return value.identifier

    def to_internal_value(self, data):
        # How the field is represented when deserialized (e.g., in requests)
        try:
            profile = Profile.objects.get(identifier=data)
        except Profile.DoesNotExist as e:
            raise serializers.ValidationError(f"Profile with this identifier does not exist. Details: {e}")
        return profile


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for the Profile model"""

    first_name = serializers.SerializerMethodField()
    job_role_list = UUIDRelatedField(
        queryset=JobRole.objects.all(),
        related_serializer_class=JobRoleSerializer,
    )
    groups = serializers.SerializerMethodField()
    client_team_member = serializers.SerializerMethodField()
    client_external_member = serializers.SerializerMethodField()
    has_access = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        exclude = [
            "id",
            "password",
            "created_at",
            "updated_at",
            "marked_for_deletion_count",
            "marked_for_deletion_at",
            "deleted_at",
            "is_active",
            "is_tester",
            "date_joined",
        ]
        read_only_fields = ["id", "is_superuser", "is_staff"]

    # Get the context to check if certain fields should be excluded
    # Used for removing nested references from other serializers, e.g. ClientSerializer
    def __init__(self, *args, **kwargs):
        self.exclude_client_fields = kwargs.get("context", {}).get("exclude_client_fields", False)
        super().__init__(*args, **kwargs)

    def get_fields(self):
        fields = super().get_fields()
        if self.exclude_client_fields:
            fields.pop("client_team_member", None)
            fields.pop("client_external_member", None)
        return fields

    def update(self, instance: Profile, validated_data):
        job_roles_data = validated_data.pop("job_role_list", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if job_roles_data is not None:
            instance.job_role_list.clear()
            instance.job_role_list.set(job_roles_data)

        instance.is_onboarded = True
        instance.save()

        return instance

    def get_name(self, obj):
        """
        Method to concatenate first name and last name into a single name.
        """
        if hasattr(obj, "user") and hasattr(obj.user, "first_name") and hasattr(obj.user, "last_name"):
            if obj.user.first_name and obj.user.last_name:
                return f"{obj.user.first_name} {obj.user.last_name}"
            return ""
        return ""

    @staticmethod
    def get_first_name(obj):
        return str(obj.first_name).split(" ", maxsplit=1)[0] if obj.first_name else "?"

    def get_groups(self, obj):
        return obj.groups.values_list("name", flat=True)

    def get_client_team_member(self, obj):
        clients = obj.employees.all()  # Reverse relation to get all related Clients where Profile is a team member
        return [{"identifier": client.identifier, "name": client.name} for client in clients]

    def get_client_external_member(self, obj):
        clients = obj.clients.all()  # Reverse relation to get all related Clients where Profile is a client member
        return [{"identifier": client.identifier, "name": client.name} for client in clients]

    def get_has_access(self, obj):
        return Client.objects.filter(Q(team_members=obj) | Q(client_members=obj)).exists()


class ProfileSearchSerializer(serializers.Serializer):
    search_term = serializers.CharField(required=True, allow_blank=False)

    def validate_search_term(self, value):
        # Strip leading and trailing whitespace
        stripped_value = value.strip()
        if not stripped_value:
            raise serializers.ValidationError("Search term cannot be blank.")
        return stripped_value
