from django.urls import path

from auditing import views

APP_NAME = "auditing"


urlpatterns = [
    path(
        "<str:identifier>/",
        views.AuditingListView.as_view(),
        name="auditlogs",
    ),
]
