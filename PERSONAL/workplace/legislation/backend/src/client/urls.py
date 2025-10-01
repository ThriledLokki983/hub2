from django.urls import include, path
from rest_framework.routers import DefaultRouter

from client import views

APP_NAME = "client"

router = DefaultRouter()
router.register("manage", views.ManageClientViewSet, basename="manage")


urlpatterns = [
    path("", include(router.urls), name="client"),
]
