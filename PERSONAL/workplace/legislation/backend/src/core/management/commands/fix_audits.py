from django.core.management.base import BaseCommand

from auditing.models import AuditLog


class Command(BaseCommand):

    def handle(self, *args, **kwargs):  # pylint: disable=W0613
        audits = AuditLog.objects.all()
        for audit in audits:
            if audit.changes.__class__ == dict:
                changes = []
                for key, value in audit.changes.items():
                    changes.append({
                        "section": key,
                        "old_value": value["old_value"],
                        "new_value": value["new_value"]
                    })
                audit.changes = changes
                audit.save()
