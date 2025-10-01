# pylint: disable=C0415
from django.apps import AppConfig
from django.db.models.signals import post_save


class AuditingConfig(AppConfig):
    name = 'auditing'

    def ready(self):
        super().ready()
        from django.apps import apps
        from .signals import post_save_handler
        for model in apps.get_models():
            post_save.connect(post_save_handler, sender=model)
