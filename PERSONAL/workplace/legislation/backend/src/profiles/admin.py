from django.contrib import admin

from profiles.models import JobRole, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):

    ordering = ("-created_at",)

    search_fields = [
        "id",
        "first_name",
        "last_name",
        "email",
    ]
    readonly_fields = ["id"]

    list_display = [
        "id",
        "email",
        "created_at",
        "identifier",
    ]

    exclude = ["password"]


@admin.register(JobRole)
class JobRoleAdmin(admin.ModelAdmin):

    ordering = ("name",)

    search_fields = [
        "id",
        "name",
    ]
    readonly_fields = ["id"]

    list_display = [
        "id",
        "name",
        "identifier",
    ]
