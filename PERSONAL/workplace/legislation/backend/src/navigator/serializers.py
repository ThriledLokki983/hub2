# pylint: disable=abstract-method
import hashlib
from datetime import date
from typing import List
from uuid import UUID

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework import serializers

from client.permissions import check_preparer_or_approver_permission
from core.serializers import IdentifierRelatedField
from navigator.utils import add_many_to_many_relations
from profiles.models import JobRole, Profile
from profiles.serializers import JobRoleSerializer

from .models import (
    AttentionPoint,
    GeographicalScope,
    IssuingJurisdiction,
    Legislation,
    LegislationType,
    NonComplianceConsequence,
    ProductService,
    RegistrationRequirement,
    RegulatoryRequirement,
    ReportingRequirement,
    Topic,
)


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    name = serializers.CharField(required=False, allow_blank=True)


class LegislationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegislationType
        fields = ["identifier", "name"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["identifier", "name"]

        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class IssuingJurisdictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssuingJurisdiction
        fields = ["identifier", "name"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class GeographicalScopeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeographicalScope
        fields = ["identifier", "name"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class ProductServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductService
        fields = ["identifier", "name"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class NonComplianceConsequenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonComplianceConsequence
        fields = ["identifier", "name"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class RegistrationRequirementSerializer(serializers.ModelSerializer):
    identifier = serializers.UUIDField()

    class Meta:
        model = RegistrationRequirement
        fields = "__all__"
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class ReportingRequirementSerializer(serializers.ModelSerializer):
    identifier = serializers.UUIDField()

    class Meta:
        model = ReportingRequirement
        fields = "__all__"
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }

    # TODO: Uncomment when way of submission selection is implemented in frontend.
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     # Send way of submission as a list
    #     way_of_submission = representation.get("way_of_submission", "")
    #     if way_of_submission:
    #         representation["way_of_submission"] = [item.strip() for item in way_of_submission.split(";")]

    #     return representation


class RegulatoryRequirementSerializer(serializers.ModelSerializer):
    identifier = serializers.UUIDField()

    class Meta:
        model = RegulatoryRequirement
        fields = "__all__"
        read_only_fields = ["id"]
        extra_kwargs = {
            "name": {"validators": []},
        }


class LegislationSerializer(serializers.ModelSerializer):
    type = LegislationTypeSerializer(many=True)
    topic = TopicSerializer(many=True)
    issuing_jurisdiction = IssuingJurisdictionSerializer(many=True)
    geographical_scope = GeographicalScopeSerializer(many=True)
    product_service = ProductServiceSerializer(many=True)
    non_compliance_consequence = NonComplianceConsequenceSerializer(many=True)
    registration_requirements = RegistrationRequirementSerializer(many=True, required=False)
    reporting_requirements = ReportingRequirementSerializer(many=True, required=False)
    regulatory_requirements = RegulatoryRequirementSerializer(many=True, required=False)
    created_by = IdentifierRelatedField(queryset=Profile.objects.all(), required=False, allow_null=True)
    attention_point_list = serializers.SerializerMethodField()
    job_role_list = JobRoleSerializer(many=True)

    class Meta:
        model = Legislation
        fields = [
            "identifier",
            "pwc_territory",
            "topic",
            "name_local",
            "abbreviation",
            "name_generic",
            "issuing_jurisdiction",
            "type",
            "geographical_scope",
            "is_in_effect",
            "effective_date",
            "effective_until",
            "responsible_authority",
            "product_service",
            "objective",
            "scope",
            "responsible_party",
            "non_compliance_consequence",
            "link",
            "additional_links",
            "pwc_contact",
            "preparation_state",
            "status",
            "review_cadence_months",
            "created_by",
            "created_at",
            "updated_at",
            "background",
            "non_compliance_risk",
            "job_role_list",
            "attention_point_list",
            "registration_requirements",
            "reporting_requirements",
            "regulatory_requirements",
        ]
        read_only_fields = ["id"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request", None)
        if request and not check_preparer_or_approver_permission(request.user):
            self.fields.pop("created_by", None)

    def get_attention_point_list(self, obj):
        attention_point_list = AttentionPoint.objects.filter(legislation=obj)
        return AttentionPointListSerializer(attention_point_list, many=True).data

    def create(self, validated_data):
        for key, value in validated_data.items():
            if isinstance(value, date):
                validated_data[key] = value.isoformat()

        requirements_data = {
            "registration_requirements": validated_data.pop("registration_requirements", []),
            "reporting_requirements": validated_data.pop("reporting_requirements", []),
            "regulatory_requirements": validated_data.pop("regulatory_requirements", []),
        }

        related_data = {
            "type": validated_data.pop("type", []),
            "topic": validated_data.pop("topic", []),
            "issuing_jurisdiction": validated_data.pop("issuing_jurisdiction", []),
            "geographical_scope": validated_data.pop("geographical_scope", []),
            "product_service": validated_data.pop("product_service", []),
            "non_compliance_consequence": validated_data.pop("non_compliance_consequence", []),
            "job_role_list": validated_data.pop("job_roles", []),
        }

        legislation = Legislation.objects.create(**validated_data)

        self.handle_requirements_create(legislation, requirements_data)

        add_many_to_many_relations(legislation, related_data)

        return legislation

    def update(self, instance: Legislation, validated_data):

        requirements_data = {
            "registration_requirements": validated_data.pop("registration_requirements", []),
            "reporting_requirements": validated_data.pop("reporting_requirements", []),
            "regulatory_requirements": validated_data.pop("regulatory_requirements", []),
        }

        related_fields_provided = {
            "type": "type" in validated_data,
            "topic": "topic" in validated_data,
            "issuing_jurisdiction": "issuing_jurisdiction" in validated_data,
            "geographical_scope": "geographical_scope" in validated_data,
            "product_service": "product_service" in validated_data,
            "non_compliance_consequence": "non_compliance_consequence" in validated_data,
            "job_role_list": "job_role_list" in validated_data,
        }
        if "abbreviation" in validated_data:
            new_abbreviation = validated_data["abbreviation"]
            if new_abbreviation != instance.abbreviation:
                # Only update if the new abbreviation is different
                if not Legislation.objects.filter(abbreviation=new_abbreviation).exclude(id=instance.id).exists():
                    instance.abbreviation = new_abbreviation

        # Handle name_local update
        if "name_local" in validated_data:
            new_name_local = validated_data["name_local"]
            if new_name_local != instance.name_local:
                # Only update if the new name_local is different
                if not Legislation.objects.filter(name_local=new_name_local).exclude(id=instance.id).exists():
                    instance.name_local = new_name_local

        related_data = {key: validated_data.pop(key, None) for key, _ in related_fields_provided.items()}

        for attr, value in validated_data.items():
            if attr not in ["abbreviation", "name_local"]:
                setattr(instance, attr, value)
        instance.save()

        self._handle_requirements(
            instance,
            requirements_data.get("reporting_requirements", []),
            ReportingRequirement,
            "reporting_requirements",
        )

        # Handle Regulatory Requirements
        self._handle_requirements(
            instance,
            requirements_data.get("regulatory_requirements", []),
            RegulatoryRequirement,
            "regulatory_requirements",
        )

        # Handle Registration Requirements
        self._handle_requirements(
            instance,
            requirements_data.get("registration_requirements", []),
            RegistrationRequirement,
            "registration_requirements",
        )

        add_many_to_many_relations(instance, related_data, related_fields_provided)

        instance.refresh_from_db()

        return instance

    def validate(self, attrs):
        request = self.context.get("request")
        if request and request.method == "POST":
            name_local = attrs.get("name_local")
            abbreviation = attrs.get("abbreviation")

            if name_local and Legislation.objects.filter(name_local=name_local).exists():
                raise serializers.ValidationError({"name_local": "Legislation with this name_local already exists."})

            if abbreviation and Legislation.objects.filter(abbreviation=abbreviation).exists():
                raise serializers.ValidationError(
                    {"abbreviation": "Legislation with this abbreviation already exists."}
                )

        return super().validate(attrs)

    def handle_requirements_create(self, legislation, requirements_data):
        """
        Handle creation of foreign key relationships for registration, reporting, and regulatory requirements.
        No identifier is provided; all requirements are created as new entries.
        """
        # Handle registration requirements
        for req_data in requirements_data.get("registration_requirements", []):
            RegistrationRequirement.objects.create(legislation=legislation, **req_data)

        # Handle reporting requirements
        for req_data in requirements_data.get("reporting_requirements", []):
            ReportingRequirement.objects.create(legislation=legislation, **req_data)

        # Handle regulatory requirements
        for req_data in requirements_data.get("regulatory_requirements", []):
            req_data["legislation"] = legislation
            RegulatoryRequirement.objects.create(legislation=legislation, **req_data)

    def _handle_requirements(self, instance, requirements_data, model_class, related_name):
        """
        Helper method to handle creation and updating of requirements.

        Args:
            instance (Legislation): The Legislation instance being updated.
            requirements_data (list): List of requirement dictionaries from the payload.
            model_class (Model): The Django model class for the requirement.
            related_name (str): The related_name for the requirement's ForeignKey to Legislation.
        """
        if not requirements_data:
            return  # No data to process

        for req_data in requirements_data:
            identifier = req_data.get("identifier")
            if identifier:
                try:
                    requirement = model_class.objects.get(identifier=identifier, legislation=instance)
                    for attr, value in req_data.items():
                        if attr == "identifier":
                            continue  # Do not update identifier
                        setattr(requirement, attr, value)
                    requirement.save()
                except model_class.DoesNotExist as exc:
                    raise serializers.ValidationError(
                        {related_name: f"{model_class.__name__} with identifier {identifier} does not exist."}
                    ) from exc

            else:
                # No identifier provided; create new requirement
                model_class.objects.create(legislation=instance, **req_data)

    # def to_representation(self, instance: Legislation):
    #     """
    #     Override to_representation to handle the retrieval of additional_links
    #     """
    #     representation = super().to_representation(instance)
    #     text = instance.additional_links

    #     if not text:
    #         representation["additional_links"] = []
    #     else:
    #         url_pattern = (
    #             r"https?://www\.[-\w.]+(?:\.[\w]{2,})+[-\w/_]*(?:\?[-\w&_=.]+)?|"
    #             r"https?://[-\w.]+(?:\.[\w]{2,})+[-\w/_]*(?:\?[-\w&_=.]+)?|"
    #             r"www\.[-\w.]+(?:\.[\w]{2,})+[-\w/_]*(?:\?[-\w&_=.]+)?"
    #         )
    #         urls = re.findall(url_pattern, text)

    #         urls = ["https://" + url if url.startswith("www.") else url for url in urls]
    #         # Remove the URLs from the text
    #         non_url_text = re.sub(url_pattern, "", text).strip()

    #         # Prepare the result list
    #         result = []
    #         if non_url_text:
    #             result.append(non_url_text)  # Add non-URL text at the beginning
    #         result.extend(urls)  # Add URLs after the text

    #         representation["additional_links"] = result
    #     return representation

    def to_internal_value(self, data):
        """
        Override to_internal_value to handle incoming data for additional_links
        """
        internal_value = super().to_internal_value(data)
        additional_links = data.get("additional_links", None)
        if additional_links:
            # If incoming links are a list, join them back into a single string
            if isinstance(additional_links, list):
                additional_links = " ".join(additional_links)
            internal_value["additional_links"] = additional_links
        return internal_value


class FilterListSerializer(serializers.Serializer):
    product_service = ProductServiceSerializer(many=True)
    geographical_scope = GeographicalScopeSerializer(many=True)
    topic = TopicSerializer(many=True)
    legislation_type = LegislationTypeSerializer(many=True)
    issuing_jurisdiction = IssuingJurisdictionSerializer(many=True)
    effective_year = serializers.ListField(child=serializers.IntegerField(), read_only=True)
    status = serializers.ListField(child=serializers.CharField(), read_only=True)
    job_roles = JobRoleSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: limit the filters to client's legislation relations
        # Fetch and set the data for each field
        self.initial_data = [
            {
                "name": "Product or service",
                "label": "product_service",
                "data": ProductServiceSerializer(ProductService.objects.all(), many=True).data,
            },
            {
                "name": "Geographical scope",
                "label": "geographical_scope",
                "data": GeographicalScopeSerializer(GeographicalScope.objects.all(), many=True).data,
            },
            {"name": "Topic", "label": "topic", "data": TopicSerializer(Topic.objects.all(), many=True).data},
            {
                "name": "Legislation type",
                "label": "type",
                "data": LegislationTypeSerializer(LegislationType.objects.all(), many=True).data,
            },
            {
                "name": "Issuing jurisdiction",
                "label": "issuing_jurisdiction",
                "data": IssuingJurisdictionSerializer(IssuingJurisdiction.objects.all(), many=True).data,
            },
            {"name": "Effective year", "label": "effective_year", "data": self.get_effective_years()},
            {"name": "Status", "label": "status", "data": self.get_statuses()},
            {
                "name": "Job roles",
                "label": "job_role_list",
                "data": JobRoleSerializer(JobRole.objects.all(), many=True).data,
            },
        ]

    def get_effective_years(self):
        years = Legislation.objects.dates("effective_date", "year")
        return [year.year for year in years]

    def get_statuses(self):
        statuses = Legislation.objects.values_list("status", flat=True).distinct()
        return list(statuses)

    def create(self, validated_data):
        raise NotImplementedError("Create method is not implemented for FilterListSerializer")

    def update(self, instance, validated_data):
        raise NotImplementedError("Update method is not implemented for FilterListSerializer")


class RoleContentSerializer(serializers.Serializer):
    legislation = LegislationSerializer()
    attention_points = serializers.ListSerializer(child=serializers.DictField(child=serializers.CharField()))

    def to_representation(self, instance):
        return {
            "legislation": instance["legislation"],
            "attention_points": instance["attention_points"],
        }

    class Meta:
        fields = ["legislation", "attention_points"]


class AttentionPointSerializer(serializers.ModelSerializer):
    legislation = LegislationSerializer()
    job_role_list = serializers.ListSerializer(child=JobRoleSerializer())

    class Meta:
        model = AttentionPoint
        fields = ["identifier", "legislation", "job_role_list", "note"]


class AttentionPointUpdateSerializer(serializers.ModelSerializer):
    job_role_list = serializers.ListField(child=serializers.UUIDField())

    class Meta:
        model = AttentionPoint
        fields = ["job_role_list", "note"]

    def to_internal_value(self, data):
        # Override to manually control the processing of incoming job_role_list
        job_role_list = data.get("job_role_list", None)
        if job_role_list is not None:
            # Ensure it's a list of valid UUIDs
            if not isinstance(job_role_list, list):
                raise serializers.ValidationError({"job_role_list": "Expected a list of UUIDs."})

            # Validate each UUID
            for uuid in job_role_list:
                try:
                    UUID(uuid)
                except ValueError as exc:
                    raise serializers.ValidationError({"job_role_list": f"{uuid} is not a valid UUID."}) from exc

        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        job_role_uuids = validated_data.pop("job_role_list", None)

        if job_role_uuids is not None:
            job_roles = JobRole.objects.filter(uuid__in=job_role_uuids)

            # Ensure the correct number of JobRole objects are found
            if job_roles.count() != len(job_role_uuids):
                raise serializers.ValidationError("One or more JobRole UUIDs are invalid.")

            # Set the job_role_list (Many-to-Many relationship)
            instance.job_role_list.set(job_roles)

        return super().update(instance, validated_data)


class AttentionPointCreateSerializer(serializers.ModelSerializer):
    legislation = serializers.UUIDField()
    job_role_list = serializers.ListSerializer(child=serializers.UUIDField())
    note = serializers.CharField(max_length=2000)

    class Meta:
        model = AttentionPoint
        fields = ["legislation", "job_role_list", "note"]

    def validate_legislation(self, value):
        try:
            legislation = Legislation.objects.get(identifier=value)
        except Legislation.DoesNotExist as exc:
            raise ValidationError("Legislation with this ID does not exist.") from exc
        return legislation

    def validate_job_role_list(self, value):
        job_roles = []
        for job_role_id in value:
            try:
                job_role = JobRole.objects.get(identifier=job_role_id)
                job_roles.append(job_role)
            except JobRole.DoesNotExist as exc:
                raise ValidationError(f"JobRole with ID {job_role_id} does not exist.") from exc
        return job_roles

    def create(self, validated_data):
        legislation: Legislation = validated_data.get("legislation")
        job_roles: List[JobRole] = validated_data.get("job_role_list")
        note: str = validated_data.get("note")

        job_role_identifiers = [job_role.identifier for job_role in job_roles]
        job_roles_sorted = sorted(job_role_identifiers)
        unique_string = f"{legislation}-{note}-{job_roles_sorted}"
        constraint_identifier = hashlib.sha256(unique_string.encode("utf-8")).hexdigest()

        try:
            attention_point = AttentionPoint.objects.create(
                legislation=legislation,
                note=note,
                constraint_identifier=constraint_identifier,
            )
            attention_point.save()

            attention_point.job_role_list.add(*job_roles)
            attention_point.save()
        except IntegrityError:
            attention_point = AttentionPoint.objects.get(constraint_identifier=constraint_identifier)

        for job_role in job_roles:
            legislation.job_role_list.add(job_role)

        attention_point.job_role_list.add(*job_roles)
        attention_point.save()

        return attention_point


class AttentionPointListSerializer(serializers.ModelSerializer):
    job_role_list = JobRoleSerializer(many=True)

    class Meta:
        model = AttentionPoint
        fields = ["identifier", "note", "job_role_list"]
