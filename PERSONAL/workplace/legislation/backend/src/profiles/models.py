import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import Group, Permission, PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from core.models import TimeStampedModel


class JobRole(TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"


class Profile(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.EmailField(
        _("email address"),
        unique=True,
        error_messages={
            "unique": _("A user with that email address already exists."),
        },
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. Unselect this instead of deleting accounts."
        ),
    )
    is_tester = models.BooleanField(
        _("test user"),
        default=False,
        help_text=_("Designates whether the user receives test features or elevated access compared to regular users."),
    )
    is_onboarded = models.BooleanField(
        _("Is onboarded"),
        default=False,
        help_text=_("Designates whether this user was onboarded."),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = UserManager()

    initials = models.CharField(max_length=255, blank=True)
    marked_for_deletion_count = models.IntegerField(
        help_text=_(
            "Once marked 5 times, fill marked_for_deletion_at. This is to ensure an "
            "outage does cause user not to be found and marked"
        ),
        default=0,
    )
    marked_for_deletion_at = models.DateTimeField(
        _("marked for deletion at"),
        default=None,
        blank=True,
        null=True,
        help_text=_("Marked for deletion when user is not found in imported system"),
    )
    deleted_at = models.DateTimeField(blank=True, null=True)

    groups = models.ManyToManyField(
        Group,
        related_name="profile_groups",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="profile_user_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
    job_role_list = models.ManyToManyField(
        JobRole,
        related_name="profiles",
        blank=True,
    )
    tour_completed = models.BooleanField(
        default=False,
        help_text="Identifier for whether or not the user completed the guided tour",
    )

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return str(self.first_name).split(" ", maxsplit=1)[0]

    def __str__(self):
        return self.get_full_name()
