from django.http import HttpResponse, HttpRequest
from django.conf import settings


class UserWhitelistMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if not request.user.is_authenticated:
            return self.get_response(request)

        if settings.USER_WHITELIST_ONLY:
            if request.user.username not in settings.USER_WHITELIST:
                return HttpResponse(
                    "<html><body><h1>Pilot fase</h1><p>You are not in the pilot user group</p></body></html>")

        return self.get_response(request)
