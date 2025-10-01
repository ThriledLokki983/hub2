import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import TimeStampedModel
from core.validators import validate_excel_and_csv_file_extension, validate_file_size
from profiles.models import Profile


class DataSource(TimeStampedModel):
    """
    A named source so we can identify data collected
    """

    class FileType(models.TextChoices):
        LEGISLATION = "LEGISLATION", _("LEGISLATION")

    identifier = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=199,
        blank=True,
        help_text="Unique name of the source, e.g. the filename-YYYYMMDD",
        unique=True,
    )

    owner = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    file = models.FileField(
        blank=True,
        null=True,
        help_text="A file field for processing in memory",
        validators=[validate_excel_and_csv_file_extension, validate_file_size],
        upload_to="temp/",
    )
    file_type = models.CharField(
        max_length=20,
        choices=(FileType.choices),
        null=True,
    )

    is_processed = models.BooleanField(
        default=False,
        help_text="For files and other one-off sources: has it been processed?",
    )
    is_archived = models.BooleanField(
        default=False,
        help_text="Records whether the file has been copied to archive",
    )

    def mark_as_processed(self):
        # Called after processing the source.. Apart from setting the is_processed marker
        # this is the place where the source file could be backed up/removed etc.
        self.is_processed = True
        self.save()

    def __str__(self):
        if self.file is not None:
            return f"{self.name}: {self.file}"
        return self.name


class DataImportLog(TimeStampedModel):
    class Level(models.TextChoices):
        MAIN = "MAIN", _("MAIN")
        SUB_PROCESS = "SUB_PROCESS", _("SUB_PROCESS")
        ERROR = "ERROR", _("ERROR")
        WARNING = "WARNING", _("WARNING")
        INFO = "INFO", _("INFO")

    identifier = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    data_source = models.ForeignKey(
        DataSource,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        default="",
    )
    process_name = models.CharField(
        max_length=199,
        blank=True,
        help_text="What is the name of the process, what does it do?",
    )
    level = models.CharField(
        max_length=20,
        choices=(Level.choices),
        default=Level.MAIN,
        null=True,
    )
    is_successful = models.BooleanField(
        default=False,
        help_text="If it was completed without major errors",
    )
    is_processed = models.BooleanField(
        default=False,
        help_text="Is the processing done, even if there are errors?",
    )
    message = models.TextField(
        max_length=12000,
        blank=True,
        null=False,
        default="",
    )
    elapsed_time_minutes = models.IntegerField(
        null=True,
        blank=True,
    )
    data = models.TextField(
        null=True,
        blank=True,
    )
