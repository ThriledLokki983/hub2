import msal
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect
from django.utils.http import urlsafe_base64_encode
from sentry_sdk import capture_message

from sso.login import LoginProvider


class MSAL(LoginProvider):

    @staticmethod
    def _cache_load(request):
        # Check for a token cache in the session
        cache = msal.SerializableTokenCache()
        if request.session.get('token_cache'):
            cache.deserialize(request.session['token_cache'])

        return cache

    @staticmethod
    def _cache_save(request, cache):
        # If cache has changed, persist back to session
        if cache.has_state_changed:
            request.session['token_cache'] = cache.serialize()

    def get_msal_app(self, cache=None):
        # Initialize the MSAL confidential client
        return msal.ConfidentialClientApplication(
            self.config.get('AAD_CLIENT_ID'),
            authority=f"https://login.microsoftonline.com/{self.config.get('AAD_TENANT_ID')}",
            client_credential=self.config.get('AAD_CLIENT_SECRET'),
            token_cache=cache)

    def get_sign_in_flow(self):
        # Method to generate a sign-in flow
        auth_app = self.get_msal_app()

        return auth_app.initiate_auth_code_flow(
            self.config.get('SCOPES'),
            redirect_uri=f"{settings.MSAL_REDIRECT_PATH}{urlsafe_base64_encode(self.settings_key.encode())}/")

    def get_token_from_code(self, request):
        # Method to exchange auth code for access token

        cache = self._cache_load(request)
        auth_app = self.get_msal_app(cache)

        # Get the flow saved in session
        flow = request.session.pop('auth_flow', {})

        result = auth_app.acquire_token_by_auth_code_flow(flow, request.GET)
        self._cache_save(request, cache)
        return result

    @staticmethod
    def get_user(token):
        """Send GET to /me endpoint"""
        user = requests.get(
            url="https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {token}"},
            params={"$select": "givenName,surName,mail,userPrincipalName"},
            timeout=settings.DEFAULT_REQUEST_TIMEOUT,
        ).json()
        if user.get("error"):
            capture_message(user["error"])

        email = user.get("mail") if (user.get("mail") is not None) else user.get("userPrincipalName")
        if not email:
            return None

        profile, _ = get_user_model().objects.get_or_create(email=email, defaults={
            'username': email,
            'first_name': user.get("givenName"),
            'last_name': user.get("surname")})
        return profile

    def sign_in(self, request):
        # Get the sign-in flow
        flow = self.get_sign_in_flow()

        # Save the expected flow so we can use it in the callback
        request.session['auth_flow'] = flow
        request.session.modified = True

        # Redirect to the Azure sign-in page
        return redirect(flow['auth_uri'])

    def start_login(self, request: HttpRequest) -> HttpResponse:
        return self.sign_in(request)


def remove_user_and_token(request):
    if 'token_cache' in request.session:
        del request.session['token_cache']

    if 'user' in request.session:
        del request.session['user']
