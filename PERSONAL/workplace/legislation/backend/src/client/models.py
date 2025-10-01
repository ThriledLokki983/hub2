import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone

from core.models import TimeStampedModel
from core.validators import validate_image_extension
from navigator.models import Legislation
from profiles.models import JobRole, Profile


class Client(TimeStampedModel):
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    domain = models.CharField(max_length=255, blank=False, null=False, unique=True)
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    team_members = models.ManyToManyField(Profile, related_name="employees", blank=True)
    client_members = models.ManyToManyField(Profile, related_name="clients", blank=True)
    is_published = models.BooleanField(default=False)
    starting_date = models.DateField(blank=True, null=True)
    created_by = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True)
    project_owner_list = models.ManyToManyField(Profile, related_name="project_owners", blank=True)
    logo = models.BinaryField(blank=False, null=True, default=None, validators=[validate_image_extension])
    sso_settings = models.CharField(
        blank=True, null=True, max_length=52, choices=[(x, x) for x in settings.LOGIN_SYSTEM.keys()]
    )

    def __str__(self):
        return f"{self.name}"


class ClientLegislation(TimeStampedModel):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    legislation = models.ForeignKey(Legislation, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False)
    published_by = models.ForeignKey(
        Profile,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="approved_legislations",
    )
    publication_date = models.DateTimeField(null=True, blank=True)
    requested_by = models.ForeignKey(
        Profile,
        related_name="requested_legislations",
        on_delete=models.CASCADE,
    )
    request_date = models.DateTimeField(auto_now_add=True)
    retracted_by = models.ForeignKey(
        Profile,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="retracted_legislations",
    )
    retraction_date = models.DateTimeField(null=True, blank=True)

    @property
    def identifier(self):
        return self.client.identifier

    class Meta:
        unique_together = ("client", "legislation")

    def publish(self, user_profile):
        """Method to publish the legislation for the client."""
        self.is_published = True
        self.published_by = user_profile
        self.publication_date = timezone.now()
        self.save()

    def retract(self, user_profile):
        self.is_published = False
        self.retracted_by = user_profile
        self.retraction_date = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.client.identifier} -- {self.legislation.identifier}"


class ClientLegislationJobRole(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        Client,
        related_name="client",
        on_delete=models.CASCADE,
    )
    legislation = models.ForeignKey(
        Legislation,
        related_name="legislation",
        on_delete=models.CASCADE,
    )
    job_role = models.ForeignKey(
        JobRole,
        related_name="jobrole",
        on_delete=models.CASCADE,
    )
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.note}"

    class Meta:
        unique_together = ("client", "legislation", "job_role")
