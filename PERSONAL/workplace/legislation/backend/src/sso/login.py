from abc import ABC, abstractmethod

from django.conf import settings
from django.http import HttpResponse, HttpRequest
from django.shortcuts import redirect


class LoginProvider(ABC):
    def __init__(self, settings_key, config: dict):
        self.settings_key = settings_key
        self.config = config

    @abstractmethod
    def start_login(self, request: HttpRequest) -> HttpResponse:
        pass


def get_provider(settings_key: str) -> LoginProvider:
    login_settings = settings.LOGIN_SYSTEM.get(settings_key)

    if login_settings is None:
        raise ValueError(f"No login settings found for {settings_key}", )

    return login_settings['provider'](settings_key, login_settings['settings'])


class PwCSSO(LoginProvider):
    def start_login(self, request: HttpRequest) -> HttpResponse:
        return redirect('/_/oauth/login')
