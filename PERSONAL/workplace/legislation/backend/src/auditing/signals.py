# pylint: disable=W0212

import base64
import json
import logging
from datetime import date, datetime

from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.signals import m2m_changed, post_save, pre_save
from django.dispatch import receiver

from .middleware.currentuser import get_current_user
from .models import AuditLog
# from .serializers import serialize_instance


@receiver(pre_save)
def pre_save_handler(sender, instance, **kwargs):
    # Check if the model is in the list of models to track
    modelname = f"{sender._meta.app_label}.{sender.__name__}"
    if modelname in settings.AUDITTRAIL_MODELS:
        if not instance.pk:
            # If the instance is new, there's no original state to store
            return
        # Retrieve and store the original instance from the database
        instance._original_state = sender.objects.get(pk=instance.pk)


@receiver(post_save)
def post_save_handler(sender, instance, created, **kwargs):
    modelname = f"{sender._meta.app_label}.{sender.__name__}"
    user = get_current_user()
    if user and modelname in settings.AUDITTRAIL_MODELS:
        if hasattr(instance, "_save_flag") and instance._save_flag:
            return
        action = "created" if created else "updated"
        changes = []
        # If the instance is not new, compare with the original state
        if not created and hasattr(instance, "_original_state"):
            for field in instance._meta.fields:
                if field.name == "updated_at":
                    continue  # Skip the updated_at field
                original_value = getattr(instance._original_state, field.name)
                current_value = getattr(instance, field.name)
                if isinstance(original_value, (date, datetime)):
                    original_value = json.dumps(original_value, cls=DjangoJSONEncoder)
                    current_value = json.dumps(current_value, cls=DjangoJSONEncoder)

                # Handle binary fields
                if isinstance(original_value, bytes) or isinstance(current_value, bytes):
                    original_value = base64.b64encode(original_value).decode("utf-8") if original_value else None
                    current_value = base64.b64encode(current_value).decode("utf-8") if current_value else None

                if original_value != current_value:
                    changes.append({
                        "section": field.name,
                        "old_value": original_value,
                        "new_value": current_value
                    })
        # If there are changes or the instance is new, create the audit log
        if changes or created:
            # serialized_data = serialize_instance(instance)
            serialized_data = {
                "section": "All",
                "old_value": "",
                "new_value": str(instance)
            }
            try:
                AuditLog.objects.create(
                    app=sender._meta.app_label,
                    model_name=sender.__name__,
                    instance_id=instance.pk,
                    identifier=instance.identifier,
                    action=action,
                    user=user,
                    changes=serialized_data if created else changes,
                )
                instance._save_flag = True
            except Exception as e:  # pylint: disable=broad-except
                logging.error("[AUDIT LOG]: %s", e, exc_info=True)


@receiver(m2m_changed)
def global_m2m_changed(sender, instance, action, model, pk_set, **kwargs):  # pylint:disable=R0913
    actions = {
        "post_add": "added",
        "post_delete": "deleted",
        "post_remove": "deleted",
        "post_clear": "deleted",
    }
    modelname = f"{sender._meta.app_label}.{sender.__name__}"
    user = get_current_user()
    if user and modelname in settings.AUDITTRAIL_MODELS and action.startswith("post_"):
        changes = []
        if pk_set:
            for _instance in model.objects.filter(id__in=pk_set):
                changes.append({
                    "section": model.__name__.lower(),
                    "old_value": str(_instance) if actions[action] == "deleted" else None,
                    "new_value": str(_instance) if actions[action] == "added" else None
                })
                AuditLog.objects.create(
                    app=instance.__class__._meta.app_label,
                    model_name=sender.__name__,
                    instance_id=instance.pk,
                    identifier=instance.identifier,
                    action=actions[action],
                    user=user,
                    changes=changes,
                )
