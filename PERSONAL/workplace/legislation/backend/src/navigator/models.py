import hashlib
import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import TimeStampedModel
from profiles.models import JobRole, Profile


class LegislationType(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=255,
        help_text=_("For example Regulation, Directive, Act, Decree, etc"),
        unique=True,
    )
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Topic(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=255,
        help_text=_(
            "Topic category, such as sustainability topic of \
                Workers in the value chain or Plastics Packaging"
        ),
        unique=True,
    )
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class IssuingJurisdiction(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=255,
        help_text=_("Select the country or jurisdiction that issued the legislation"),
        unique=True,
    )
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class GeographicalScope(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=255,
        help_text=_("Select the area where the law applies "),
        unique=True,
    )
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ProductService(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=255,
        help_text=_("If applicable, specify whether the legislation applies to specific products and/ or services"),
        unique=True,
    )
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class NonComplianceConsequence(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=255,
        help_text=_("Select the relevant consequences that may follow from non-compliance with this legislation"),
        unique=True,
    )
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class RegistrationRequirement(TimeStampedModel):
    """
    Registration requirements refer to the process of officially enrolling or recording
    certain information with a relevant authority or organization.
    It typically involves providing specific details about an individual,
    entity, or activity to establish legal recognition or compliance
    """

    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    legislation = models.ForeignKey(
        "Legislation",
        null=True,
        on_delete=models.CASCADE,
        related_name="registration_requirements",
    )
    description = models.TextField(
        verbose_name=_("General description"),
        help_text=_("A general high-level description on the registration requirements"),
    )
    responsible_authority = models.TextField(
        verbose_name=_("Responsible authority"),
        help_text=_(
            "The authority defined in the legislation as the responsible authority for \
                the enforcement of the regulatory requirements"
        ),
    )
    trigger = models.TextField(
        verbose_name=_("Activities that trigger requirements"),
        help_text=_(
            "A description of the activities that will trigger the obligation to comply \
                with the registration requirements"
        ),
    )
    responsible_party = models.TextField(
        verbose_name=_("Responsible party"),
        help_text=_(
            "Defined within the legislation as the economic operator that must comply \
                with the registration requirements"
        ),
    )
    data_elements = models.TextField(
        verbose_name=_("Data elements required"),
        help_text=_(
            "Specific information necessary to submit the registration application. \
                Should be in bullet format"
        ),
    )
    payment_obligations = models.TextField(
        verbose_name=_("Payment obligations"),
        help_text=_("If applicable, a description of the fee or contribution that must be paid for the registration"),
        null=True,
        blank=True,
    )
    deadline = models.TextField(
        verbose_name=_("Deadline"),
        help_text=_("The due date by which the responsible party must comply with the registration requirements"),
        null=True,
        blank=True,
    )
    threshold = models.TextField(
        verbose_name=_("Threshold"),
        help_text=_(
            "If applicable, the minimum criteria that must be met before the registration requirements apply, \
                as well as phase-in provisions"
        ),
        null=True,
        blank=True,
    )
    sanctions = models.TextField(
        verbose_name=_("Sanctions"),
        help_text=_("If applicable, the penalties or consequences imposed as a result of non-compliance"),
        null=True,
        blank=True,
    )
    exemptions = models.TextField(
        verbose_name=_("Exemptions"),
        help_text=_("If applicable, the specific conditions under which the registration requirements do not apply"),
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.description


# class WayOfSubmission(TimeStampedModel):
#     identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
#     name = models.CharField(
#         max_length=255,
#         help_text=_("Select the relevant ways of submitting"),
#     )

#     def __str__(self):
#         return self.name


class ReportingRequirement(TimeStampedModel):
    """
    Reporting requirements are rules, or obligations on either submitting information to an
    external party such as a a relevant authority or organization, as well as rules or obligations on
    publishing information in for instance an annual statement or on a website
    """

    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    legislation = models.ForeignKey(
        "Legislation",
        null=True,
        on_delete=models.CASCADE,
        related_name="reporting_requirements",
    )
    description = models.TextField(
        verbose_name=_("General description"),
        help_text=_("A general high-level description on the reporting requirements"),
    )
    responsible_authority = models.TextField(
        verbose_name=_("Responsible authority"),
        help_text=_(
            "The authority defined in the legislation as the responsible authority for \
                the enforcement of the reporting requirements"
        ),
    )
    trigger = models.TextField(
        verbose_name=_("Activities that trigger requirements"),
        help_text=_(
            "A description of the activities that will trigger the obligation to comply \
                with the reporting requirements"
        ),
    )
    responsible_party = models.TextField(
        verbose_name=_("Responsible party"),
        help_text=_(
            "Defined within the legislation as the economic operator that must comply \
                with the reporting requirements"
        ),
    )
    data_elements = models.TextField(
        verbose_name=_("Data elements required"),
        help_text=_(
            "Specific information necessary to submit the reporting application. \
                Should be in bullet format"
        ),
        null=True,
        blank=True,
    )
    language = models.TextField(
        verbose_name=_("Language of reporting"),
        help_text=_("If applicable, the specific language in which the reporting must take place"),
        null=True,
        blank=True,
    )
    frequency = models.TextField(
        verbose_name=_("Language of reporting"),
        help_text=_("If applicable, the occurrence in which the reporting requirements take place"),
        null=True,
        blank=True,
    )
    deadline = models.TextField(
        verbose_name=_("Deadline"),
        help_text=_("The due date by which the responsible party must comply with the reporting requirements"),
        null=True,
        blank=True,
    )
    way_of_submission = models.TextField(
        verbose_name=_("Way of Submission"),
        help_text=_("How the requirement is fulfilled"),
        null=True,
        blank=True,
    )

    payment_obligations = models.TextField(
        verbose_name=_("Payment obligations and rates"),
        help_text=_(
            "If applicable, a description of the payment obligations associated with the reporting, \
                as well as the applicable rates."
        ),
        null=True,
        blank=True,
    )
    retainment_of_records = models.TextField(
        verbose_name=_("Retainment of records"),
        help_text=_(
            "If applicable, a description on the requirement to maintain records for \
                a specified time, as well as which information must be archived."
        ),
        null=True,
        blank=True,
    )
    refund_possibilities = models.TextField(
        verbose_name=_("Refund possibilities"),
        help_text=_(
            "If applicable, a description of the possibility to request a refund and \
                the applicable criteria that need to be met."
        ),
        null=True,
        blank=True,
    )
    threshold = models.TextField(
        verbose_name=_("Threshold"),
        help_text=_(
            "If applicable, the minimum criteria that must be met before the reporting requirements apply, \
                as well as phase-in provisions"
        ),
        null=True,
        blank=True,
    )
    sanctions = models.TextField(
        verbose_name=_("Sanctions"),
        help_text=_("If applicable, the penalties or consequences imposed as a result of non-compliance"),
        null=True,
        blank=True,
    )
    exemptions = models.TextField(
        verbose_name=_("Exemptions"),
        help_text=_("If applicable, the specific conditions under which the reporting requirements do not apply"),
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.description


class RegulatoryRequirement(TimeStampedModel):
    """
    Regulatory requirements are rules, standards, or obligations established to govern activities or
    entities that must be complied with.
    """

    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    legislation = models.ForeignKey(
        "Legislation",
        null=True,
        on_delete=models.CASCADE,
        related_name="regulatory_requirements",
    )
    description = models.TextField(
        verbose_name=_("General description"),
        help_text=_("A general high-level description on the regulatory requirements"),
    )
    responsible_authority = models.TextField(
        verbose_name=_("Responsible authority"),
        help_text=_(
            "The authority defined in the legislation as the responsible authority for \
                the enforcement of the regulatory requirements"
        ),
    )
    trigger = models.TextField(
        verbose_name=_("Activities that trigger requirements"),
        help_text=_(
            "A description of the activities that will trigger the obligation to comply \
                with the regulatory requirements"
        ),
    )
    responsible_party = models.TextField(
        verbose_name=_("Responsible party"),
        help_text=_(
            "Defined within the legislation as the economic operator that must comply \
                with the regulatory requirements"
        ),
    )
    key_actions = models.TextField(
        verbose_name=_("Key actions for compliance"),
        help_text=_(
            "If applicable, actions that the responsible party must take to ensure \
                compliance with the regulatory requirements"
        ),
    )
    deadline = models.TextField(
        verbose_name=_("Deadline"),
        help_text=_("The due date by which the responsible party must comply with the regulatory requirements"),
        null=True,
        blank=True,
    )
    threshold = models.TextField(
        verbose_name=_("Threshold"),
        help_text=_(
            "If applicable, the minimum criteria that must be met before the regulatory requirements apply, \
                as well as phase-in provisions"
        ),
        null=True,
        blank=True,
    )
    sanctions = models.TextField(
        verbose_name=_("Sanctions"),
        help_text=_("If applicable, the penalties or consequences imposed as a result of non-compliance"),
        null=True,
        blank=True,
    )
    exemptions = models.TextField(
        verbose_name=_("Exemptions"),
        help_text=_("If applicable, the specific conditions under which the regulatory requirements do not apply"),
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.description


class Legislation(TimeStampedModel):

    class PreparationState(models.TextChoices):
        CREATED = "CREATED", _("CREATED")
        IN_REVIEW = "IN_REVIEW", _("IN REVIEW")
        APPROVED = "APPROVED", _("APPROVED")

    class Status(models.TextChoices):
        IN_EFFECT = "IN EFFECT", _("IN EFFECT")
        PENDING = "PENDING", _("PENDING")
        OUTDATED = "OUTDATED", _("OUTDATED")

    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    pwc_territory = models.TextField(
        _("PwC Territory that prepared the legislation details"),
        help_text=_("Add the PwC Territory which provided information about the legislation"),
        null=True,
        blank=True,
        default=None,
    )
    topic = models.ManyToManyField(
        Topic,
        verbose_name=_("Topic"),
        related_name="topic",
        help_text=_("Select the relevant topics from the drop-down menu"),
    )
    name_local = models.CharField(
        max_length=255,
        help_text=_("Name of legislation in the original language"),
        unique=True,
    )
    abbreviation = models.CharField(
        max_length=255,
        help_text=_("If applicable, the common abbreviation used for this legislation"),
        null=True,
        blank=True,
        unique=True,
    )
    name_generic = models.CharField(
        max_length=255,
        help_text=_("If applicable, the common English translation for this (type) of legislation"),
        null=True,
        blank=True,
    )
    issuing_jurisdiction = models.ManyToManyField(
        IssuingJurisdiction,
        verbose_name=_("Issuing Jurisdiction"),
        related_name="issuing_jurisdiction",
        help_text=_("Select the country or jurisdiction that issued the legislation"),
    )
    type = models.ManyToManyField(
        LegislationType,
        verbose_name=_("Legislation Type"),
        related_name="legislation_type",
        help_text=_("For example Regulation, Directive, Act, Decree, etc"),
    )
    geographical_scope = models.ManyToManyField(
        GeographicalScope,
        verbose_name=_("Geographical Scope"),
        related_name="geographical_scope",
        help_text=_("Select the area where the law applies"),
    )
    is_in_effect = models.BooleanField(
        _("In effect"),
        help_text=_("If the legislation has been put into effect"),
        default=False,
    )
    effective_date = models.DateField(
        _("Effective Date"),
        help_text=_("Select the date as of when the legislation is or will be first applicable"),
        blank=True,
        null=True,
    )
    effective_until = models.DateField(
        _("Effective Date Until"),
        help_text=_("If applicable, select the end date of the legislation."),
        blank=True,
        null=True,
        default=None,
    )
    responsible_authority = models.TextField(
        _("Responsible Authority"),
        help_text=_("Specify which authority is responsible for the enforcement of this legislation"),
        null=True,
    )
    product_service = models.ManyToManyField(
        ProductService,
        verbose_name=_("Relevant product (group) or services"),
        related_name="product_service",
        help_text=_(
            "If applicable, specify whether the legislation applies to specific \
                    products and/ or services"
        ),
    )
    objective = models.TextField(
        _("Objective of the legislation (summary)"),
        help_text=_("Short summary of the objective/ goal of the legislation"),
    )
    scope = models.TextField(
        _("Scope of the legislation (summary)"),
        help_text=_(
            "Short summary on the relevant definitions regarding the activities that \
                trigger the applicability of the legislation"
        ),
    )
    responsible_party = models.TextField(
        _("Responsible party (summary)"),
        help_text=_(
            "Short summary on who is defined within the legislation as the parties (i.e. economic operators)\
                to whom the legislation applies"
        ),
        null=True,
    )
    non_compliance_consequence = models.ManyToManyField(
        NonComplianceConsequence,
        verbose_name=_("Consequences of non-compliance"),
        related_name="non_compliance_consequence",
        help_text=_("Select the relevant consequences that may follow from non-compliance with this legislation"),
    )

    # registration_requirements = models.ManyToManyField(
    #     RegistrationRequirement,
    #     verbose_name=_("Registration Requirements"),
    #     related_name="registration_requirements",
    #     help_text=_(
    #         "Registration requirements refer to the process of officially enrolling or recording \
    #             certain information with a relevant authority or organization. \
    #             It typically involves providing specific details about an individual, \
    #             entity, or activity to establish legal recognition or compliance"
    #     ),
    #     blank=True,
    # )
    # reporting_requirements = models.ManyToManyField(
    #     ReportingRequirement,
    #     verbose_name=_("Reporting Requirements"),
    #     related_name="reporting_requirements",
    #     help_text=_(
    #         "Reporting requirements are rules, or obligations on either submitting information \
    #             to an external party such as a a relevant authority or organization, as well as \
    #             rules or obligations on publishing information in for instance an annual statement \
    #             or on a website"
    #     ),
    #     blank=True,
    # )
    # regulatory_requirements = models.ManyToManyField(
    #     RegulatoryRequirement,
    #     verbose_name=_("Regulatory Requirements"),
    #     related_name="regulatory_requirements",
    #     help_text=_(
    #         "Regulatory requirements are rules, standards, or obligations established to govern \
    #             activities or entities that must be complied with."
    #     ),
    #     blank=True,
    # )
    link = models.TextField(
        _("Link to legislation"),
        help_text=_("Include a weblink to the legislation"),
    )
    additional_links = models.TextField(
        _("Additional guidance links relating to to legislation"),
        help_text=_("Include a weblink to the guidance"),
        null=True,
        blank=True,
        default=None,
    )
    pwc_contact = models.ManyToManyField(
        Profile,
        verbose_name=_("Relevant PwC contact"),
        related_name="pwc_contact",
        help_text=_("Who within PwC is the person of contact for this legislation"),
        blank=True,
    )

    preparation_state = models.CharField(
        max_length=20,
        choices=(PreparationState.choices),
        default=PreparationState.CREATED,
    )
    status = models.CharField(
        max_length=20,
        choices=(Status.choices),
        default=Status.IN_EFFECT,
    )
    # update_status = models.CharField(
    #     max_length=50,
    #     choices=[
    #         ("update_status1", "Update Status 1"),
    #         ("update_status2", "Update Status 2"),
    #     ],
    # )
    # update_record = models.ForeignKey(
    #     "self",
    #     null=True,
    #     blank=True,
    #     on_delete=models.SET_NULL,
    #     related_name="update_records",
    # )
    review_cadence_months = models.IntegerField(default=6)
    # review_responsible = models.ForeignKey(
    #     "auth.User",
    #     null=True,
    #     blank=True,
    #     on_delete=models.SET_NULL,
    #     related_name="review_responsible_legislations",
    # )
    # content_responsible = models.ForeignKey(
    #     "auth.User",
    #     null=True,
    #     blank=True,
    #     on_delete=models.SET_NULL,
    #     related_name="content_responsible_legislations",
    # )
    created_by = models.ForeignKey(
        Profile,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="created_legislations",
    )
    background = models.TextField(
        _("Background"),
        help_text=_("Explanation of legislation in Layman's terms"),
        null=True,
        blank=True,
    )
    non_compliance_risk = models.TextField(
        _("Risk of non-compliance"),
        help_text=_("Explanation of the risks of not complying with the legislation"),
        null=True,
        blank=True,
    )
    job_role_list = models.ManyToManyField(
        JobRole,
        verbose_name=_("Jop role list"),
        related_name="job_role_list_legislation",
        help_text=_("Job roles associated with this legislation"),
        blank=True,
    )

    def __str__(self):
        return self.name_local


class AttentionPoint(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    legislation = models.ForeignKey(Legislation, on_delete=models.CASCADE)
    job_role_list = models.ManyToManyField(JobRole, related_name="job_role_list", blank=True)
    note = models.TextField(max_length=2000)
    constraint_identifier = models.CharField(max_length=255, editable=False, unique=True, null=True, blank=True)

    def __str__(self):
        return f"{self.note}"

    def save(self, *args, **kwargs):
        """
        Generate a unique identifier based on legislation, note, and job roles.
        Since job_role_list is a many to many field, it does not have a default way
        to create a constraint, so a custom constraint_identifier has to be created.

        A custom migration file was created to add the constraint since the note has
        to be minified ()
        """
        if not self.pk:
            super().save(*args, **kwargs)

        job_roles_sorted = sorted(self.job_role_list.values_list("identifier", flat=True))
        unique_string = f"{self.legislation}-{self.note}-{job_roles_sorted}"
        self.constraint_identifier = hashlib.sha256(unique_string.encode("utf-8")).hexdigest()

        super().save(*args, **kwargs)
