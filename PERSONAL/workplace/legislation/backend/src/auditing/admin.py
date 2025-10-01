from django.contrib import admin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "app",
        "model_name",
        "identifier",
        "action",
        "user_id",
        "timestamp",
    )
    list_filter = (
        "action",
        "user",
        "model_name",
    )
    search_fields = ("instance_id", "identifier")
