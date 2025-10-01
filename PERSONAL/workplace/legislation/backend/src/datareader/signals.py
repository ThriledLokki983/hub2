from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import IntegrityError, transaction
from django.db.models.signals import post_migrate
from django.dispatch import receiver

from .models import DataImportLog, DataSource


@receiver(post_migrate)
def create_data_upload_permissions(sender, **kwargs):
    group, created = Group.objects.get_or_create(name="File Uploader")

    # Permissions creation
    for codename, name in [
        ("add_datasource", "Can add DataSource"),
        ("change_datasource", "Can change DataSource"),
        ("view_dataimportlog", "Can view DataImportLog"),
    ]:
        try:
            # Start a new transaction for each permission to avoid rollback affecting all permissions
            with transaction.atomic():
                # Fetch the correct content type for the permission
                if "datasource" in codename:
                    content_type = ContentType.objects.get_for_model(DataSource)
                else:
                    content_type = ContentType.objects.get_for_model(DataImportLog)

                # Get or create the permission
                permission, created = Permission.objects.get_or_create(
                    codename=codename,
                    name=name,
                    content_type=content_type,
                )

                # If the permission was newly created, add it to the group
                if created:
                    group.permissions.add(permission)

        except IntegrityError:
            # If the permission already exists, we can continue and try to add it to the group
            permission = Permission.objects.get(codename=codename, content_type=content_type)
            if permission not in group.permissions.all():
                group.permissions.add(permission)
