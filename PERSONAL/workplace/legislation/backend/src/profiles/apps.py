# pylint: disable=import-outside-toplevel
from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "profiles"

    def ready(self):
        import profiles.signals  # pylint: disable=import-outside-toplevel, unused-import
