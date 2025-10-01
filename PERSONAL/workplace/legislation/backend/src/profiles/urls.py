# Create your views here.
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles import views

APP_NAME = "profiles"

router = DefaultRouter()
router.register("profile", views.ProfileViewSet, basename="profile")
router.register("jobrole", views.JobRoleViewSet, basename="jobrole")


urlpatterns = [
    path("", include(router.urls), name="profiles"),
]
