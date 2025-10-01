from typing import List

from django.contrib import admin, messages

from navigator.models import (
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


class AttentionPointInline(admin.TabularInline):
    model = AttentionPoint
    extra = 1


@admin.register(LegislationType)
class LegislationTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_approved", "identifier")
    search_fields = ("name",)
    list_filter = ("is_approved",)


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_approved", "identifier")
    search_fields = ("name",)
    list_filter = ("is_approved",)


@admin.register(IssuingJurisdiction)
class IssuingJurisdictionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_approved", "identifier")
    search_fields = ("name",)
    list_filter = ("is_approved",)


@admin.register(GeographicalScope)
class GeographicalScopeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_approved", "identifier")
    search_fields = ("name",)
    list_filter = ("is_approved",)


@admin.register(ProductService)
class ProductServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_approved", "identifier")

    search_fields = ("name",)
    list_filter = ("is_approved",)


@admin.register(NonComplianceConsequence)
class NonComplianceConsequenceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_approved", "identifier")
    search_fields = ("name",)
    list_filter = ("is_approved",)


@admin.register(RegistrationRequirement)
class RegistrationRequirementsAdmin(admin.ModelAdmin):
    list_display = ("id", "legislation", "description", "identifier")
    search_fields = ("description",)
    list_filter = ("legislation",)


@admin.register(ReportingRequirement)
class ReportingRequirementsAdmin(admin.ModelAdmin):
    list_display = ("id", "legislation", "description", "identifier")
    search_fields = ("description",)
    list_filter = ("legislation",)


@admin.register(RegulatoryRequirement)
class RegulatoryRequirementsAdmin(admin.ModelAdmin):
    list_display = ("id", "legislation", "description", "identifier")
    search_fields = ("description",)
    list_filter = ("legislation",)


class ReportingRequirementInline(admin.TabularInline):
    model = ReportingRequirement
    extra = 0
    readonly_fields = ("identifier",)


class RegulatoryRequirementInline(admin.TabularInline):
    model = RegulatoryRequirement
    extra = 0
    readonly_fields = ("identifier",)


class RegistrationRequirementInline(admin.TabularInline):
    model = RegistrationRequirement
    extra = 0
    readonly_fields = ("identifier",)


@admin.register(Legislation)
class LegislationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "updated_at",
        "identifier",
        "name_local",
        "name_generic",
        "abbreviation",
        "effective_date",
        "is_in_effect",
        "preparation_state",
        "review_cadence_months",
        "created_by",
        "pwc_territory",
    )
    search_fields = ("name_local",)
    filter_horizontal = (
        "type",
        "topic",
        "issuing_jurisdiction",
        "geographical_scope",
        "product_service",
        "non_compliance_consequence",
    )
    list_filter = (
        "is_in_effect",
        "preparation_state",
        "pwc_territory",
    )
    inlines = [
        AttentionPointInline,
        ReportingRequirementInline,
        RegulatoryRequirementInline,
        RegistrationRequirementInline,
    ]

    actions = ["update_job_roles_from_attention_points"]

    @admin.action(description="Update job roles based on associated attention points")
    def update_job_roles_from_attention_points(self, request, queryset: List[Legislation]):
        for legislation in queryset:
            attention_points = AttentionPoint.objects.filter(legislation=legislation)
            unique_job_roles = set()
            for attention_point in attention_points:
                unique_job_roles.update(attention_point.job_role_list.all())

            legislation.job_role_list.set(unique_job_roles)
            legislation.save()

        self.message_user(request, "Job roles updated based on attention points for selected legislation(s).")


@admin.register(AttentionPoint)
class AttentionPointAdmin(admin.ModelAdmin):
    list_display = (
        "identifier",
        "legislation",
        "note",
        "display_job_roles",
        "constraint_identifier",
    )
    list_filter = ("legislation",)

    search_fields = ("legislation__name_local", "job_role_list__name")

    def display_job_roles(self, obj):
        # This will return a comma-separated list of job role names
        return ", ".join([job_role.name for job_role in obj.job_role_list.all()])

    display_job_roles.short_description = "Job Roles"

    actions = ["remove_duplicates", "populate_constraint_identifier"]

    @admin.action(description="Remove duplicates based on legislation, note, and job roles")
    def remove_duplicates(self, request, queryset):
        duplicates = {}
        deleted_count = 0

        for attention_point in AttentionPoint.objects.all():
            # Create a key based on legislation, note, and sorted job roles
            key = (
                attention_point.legislation_id,
                attention_point.note,
                tuple(sorted(attention_point.job_role_list.values_list("id", flat=True))),
            )

            if key in duplicates:
                # If the key already exists, delete this duplicate
                attention_point.delete()
                deleted_count += 1
            else:
                duplicates[key] = attention_point

        self.message_user(request, f"Removed {deleted_count} duplicate attention points.", messages.SUCCESS)

    @admin.action(description="Populate constraint_identifier for selected records")
    def populate_constraint_identifier(self, request, queryset):
        for attention_point in queryset:
            if not attention_point.constraint_identifier:
                attention_point.save()
        self.message_user(request, "constraint_identifier field populated for selected records.")
