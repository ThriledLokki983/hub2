from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **kwargs):  # pylint: disable=W0613
        # Optional function that runs through CRON
        return
