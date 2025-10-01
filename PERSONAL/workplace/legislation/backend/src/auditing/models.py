from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    app = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    instance_id = models.PositiveIntegerField()
    identifier = models.UUIDField(default=None, editable=False)
    action = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField()

    def __str__(self):
        return f"{self.model_name} ({self.identifier}) {self.action} by {self.user} at {self.timestamp}"
