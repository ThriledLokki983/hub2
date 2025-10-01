from django.http import HttpResponse, HttpRequest
from django.conf import settings


class ForceAdminMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if not request.user.is_authenticated:
            return self.get_response(request)

        admins = settings.FORCE_ADMIN or []
        user = request.user
        if user.username in admins and not user.is_staff or not user.is_superuser:
            user.is_staff = True
            user.is_superuser = True
            user.save()

        return self.get_response(request)
