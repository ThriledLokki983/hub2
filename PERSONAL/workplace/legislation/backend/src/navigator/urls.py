from django.urls import include, path
from rest_framework.routers import DefaultRouter

from navigator import views

APP_NAME = "navigator"

router = DefaultRouter()
router.register("legislation", views.LegislationViewSet, basename="legislation")
router.register("role-content", views.RoleContentView, basename="rolecontent")
router.register("attention-point", views.AttentionPointView, basename="attention-point")
router.register("reporting-requirement", views.ReportingRequirementViewSet, basename="reporting-requirement")
router.register("registration-requirement", views.RegistrationRequirementViewSet, basename="registration-requirement")
router.register("regulatory-requirement", views.RegulatoryRequirementViewSet, basename="regulatory-requirement")

urlpatterns = [
    path("", include(router.urls), name="navigator"),
    path(
        "legislation/<uuid:legislation_id>/attention-points/",
        views.LegislationAttentionPointListView.as_view(),
        name="legislation-attention-points",
    ),
]
