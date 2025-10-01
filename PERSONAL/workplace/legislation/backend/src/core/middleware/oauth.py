import uuid

import jwt
import requests
from django.conf import settings
from django.contrib.auth import get_user_model, login
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import redirect
from django.utils.html import escape

from client.models import Client
from core import views


class OAuthMiddleware:

    # pylint: skip-file

    def __init__(self, get_response):
        self.get_response = get_response
        self.__check_conf()
        self.__client = settings.OAUTH_CLIENT
        self.__production = self.__client.get("production", False)
        self.__endpoint = "https://login.pwc.com/openam"
        if not self.__production:
            self.__endpoint = "https://login-stg.pwc.com/openam"
        self.__access_token_url = f"{self.__endpoint}/oauth2/access_token"
        self.__logout_uri_default = f"{self.__endpoint}/XUI/#logout"
        self.__authorize_url = f"{self.__endpoint}/oauth2/authorize"
        self.__access_token_url = f"{self.__endpoint}/oauth2/access_token"
        self.__endsession_url = f"{self.__endpoint}/oauth2/connect/endSession"
        self.__well_known_url = f"{self.__endpoint}/oauth2/realms/root/realms/pwc/.well-known/openid-configuration"
        self.__redirect_uri = self.__client["redirect_uri"]
        self.__client_id = self.__client["client_id"]
        self.__client_secret = self.__client["client_secret"]
        self.__scope = self.__client["scope"]
        self.__whitelist = self.__client.get("whitelist", [])
        self.__options = {"verify_signature": False}
        self.__auto_populate_user = self.__client.get("auto_populate_user", False)
        self.override = self.__client.get("redirect_uri_override", "")
        self.__post_logout_redirect_uri = self.__client.get("post_logout_redirect_uri", None)
        self.request_timeout = 60

    def make_state(self):
        override = f"_{self.override}" if self.override != "" else ""
        return f"{str(uuid.uuid4()).replace('-', '')}{override}"

    @staticmethod
    def __check_conf() -> None:
        if hasattr(settings, "OAUTH_CLIENT"):
            required = ["client_id", "client_secret", "redirect_uri", "scope"]
            _client = getattr(settings, "OAUTH_CLIENT")
            for _r in required:
                if _r not in _client:
                    raise Exception(f"Missing required parameter '{_r}' in settings.OAUTH_CLIENT.")
            return
        raise Exception("Settings dictionary OAUTH_CLIENT not found in settings.")

    def __call__(self, request) -> HttpResponse:
        if request.path.startswith("/_/healthz"):
            return self.get_response(request)
        if request.path.startswith("/_/oauth/config"):
            return self.__config()
        if request.path.startswith("/_/oauth/session"):
            return self.__session(request)
        if request.path.startswith("/_/oauth/login"):
            return self.__get_authorization(request)
        if request.path.startswith("/_/oauth/logout"):
            return self.logout(request)
        if request.path.startswith("/api/") or request.path.startswith("/_/api/"):
            if not request.user.is_authenticated:
                raise PermissionDenied()
        if request.GET.get("error_description", None):
            return self.__failure(request.GET.get("error_description"))
        if self.__whitelist:
            for _w in self.__whitelist:
                if request.path.startswith(_w):
                    return self.get_response(request)

        if request.path.startswith("/callback"):
            if "_" in request.GET.get("state"):
                state = request.GET["state"].split("_")
                code = state[0]
                override_url = state[1]
                redir_override = (
                    f'{override_url}?code={request.GET["code"]}&iss={request.GET["iss"]}&'
                    f'client_id={request.GET["client_id"]}&state={code}'
                )
                return redirect(redir_override)
            code = request.GET.get("code", None)
            token = self.__get_token(code)
            userdata = self.__decode_token(token.get("id_token"))
            request.session["token"] = token
            request.session["user"] = userdata
            request.session["id_token_hint"] = token.get("id_token")
            request.session.modified = True
            user = self.__login_user(request)
            if not user:
                return HttpResponseForbidden()
            return redirect(views.home)

        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        if getattr(view_func, 'login_exempt', False):  # set by decorator
            return view_func(request, *view_args, **view_kwargs)

        if not request.user.is_authenticated:
            return self.__get_authorization(request)

        return view_func(request, *view_args, **view_kwargs)

    def __get_token(self, code) -> dict:
        post_data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.__redirect_uri,
            "client_id": self.__client_id,
            "client_secret": self.__client_secret,
        }
        res = requests.post(self.__access_token_url, data=post_data, timeout=self.request_timeout)
        return res.json()

    def __decode_token(self, id_token) -> dict:
        user_data = jwt.decode(id_token, options=self.__options)
        return user_data

    def __get_authorization(self, request) -> HttpResponse:
        state = self.make_state()
        uri = (
            f"{self.__authorize_url}?response_type=code&client_id={self.__client_id}&scope={self.__scope}&"
            f"redirect_uri={self.__redirect_uri}&state={state}"
        )
        return redirect(uri)

    def __login_user(self, request) -> get_user_model():
        userdata = request.session["user"]
        domain = userdata["preferredMail"].split("@")[1]
        client = Client.objects.filter(domain=domain).first()
        created = None

        print(userdata)

        # TODO: Auto client creating needs to be removed after testing. Clients are created manual
        if not client:
            client, _ = Client.objects.get_or_create(
                domain=domain, name=userdata.get("organization", f"Unknown ({domain})")
            )

        if self.__auto_populate_user:
            if client:
                user, created = get_user_model().objects.get_or_create(email=userdata["preferredMail"])
            else:
                return None
        user = get_user_model().objects.get(email=userdata["preferredMail"])
        if created:
            user.first_name = userdata["given_name"]
            user.username = userdata["preferredMail"]
            user.last_name = userdata["family_name"]
            user.save()
        login(request, user)
        return user

    def __endsession(self, request) -> HttpResponse:
        uri = (
            f"{self.__endsession_url}?id_token_hint={request.session['id_token_hint']}&"
            f"post_logout_redirect_uri={self.__post_logout_redirect_uri}"
        )
        keys = [key for key in request.session.keys()]
        for key in keys:
            del request.session[key]
        return redirect(uri)

    def __uilogout(self, request) -> HttpResponse:
        keys = [key for key in request.session.keys()]
        for key in keys:
            del request.session[key]
        request.session.modified = True
        host = request.META["HTTP_HOST"]
        protocol = "https" if "HTTPS" in request.META["SERVER_PROTOCOL"] else "http"
        return redirect(f"{self.__logout_uri_default}&goto={protocol}://{host}")

    def logout(self, request) -> HttpResponse:
        if self.__post_logout_redirect_uri != "":
            return self.__endsession(request)
        return self.__uilogout(request)

    def __config(self) -> HttpResponse:
        res = requests.get(self.__well_known_url, timeout=self.request_timeout)
        summary = "<h1>PwC OAUTH Well-Known Configuration</h1>"
        rows = ""
        for key, value in res.json().items():
            if isinstance(value, list):
                value = "<br/>".join(escape(str(v)) for v in value)
            else:
                value = escape(str(value))
            rows = rows + f"<tr><th>{key}</th><td>{value}</td></tr>"
        return HttpResponse(
            f"<html><body>{summary}<table border=1 cellpadding=10 cellspacing=0>{rows}" f"</table></body></html>"
        )

    @staticmethod
    def __session(request) -> HttpResponse:
        summary = "<h1>Session information</h1>"
        rows = ""
        for key in request.session.keys():
            rows = rows + f"<tr><th>{key}</th><td>{request.session[key]}</td></tr>"
        return HttpResponse(
            f"<html><body>{summary}<table border=1 cellpadding=10 cellspacing=0>{rows}" f"</table></body></html>"
        )

    @staticmethod
    def __failure(error) -> HttpResponse:
        summary = "<h1>OAUTH Failed</h1>"
        return HttpResponse(f"<html><body>{summary}<p>{error}</p></body></html>")
