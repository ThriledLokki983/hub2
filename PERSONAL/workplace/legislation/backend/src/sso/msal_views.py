# import logging

from django.contrib.auth import login
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.utils.http import urlsafe_base64_decode

from core.decorators import login_exempt
from sso.login import get_provider
from sso.msal_helper import MSAL


@login_exempt
def callback(request, sso_settings):
    sso_settings = urlsafe_base64_decode(sso_settings).decode()
    # logging.error("CALLBACK SSO SETTINGS: %s", sso_settings)

    provider = get_provider(sso_settings)
    # logging.error("CALLBACK PROVIDER: %s", provider)

    if not isinstance(provider, MSAL):
        # logging.error("CALLBACK PROVIDER NOT MSAL. PERMISSION DENIED")
        raise PermissionDenied()

    try:
        # Normal login flow
        result = provider.get_token_from_code(request)
        # logging.error("TOKEN FROM CODE: %s", result)
        user = provider.get_user(result.get("access_token"))
        # logging.error("USER FROM PROVIDER: %s", user)

        if not user:
            # logging.error("USER NOT FOUND. REDIRECTING TO LOGIN-FAIL")
            if request.get_host() == "localhost:8000":
                return redirect("http://localhost:3000/login-fail")
            return redirect("login-fail")  # TODO (WvdA): where do we go from here?

        login(request, user)
    except ValueError as e:
        # Either got a State Missing or State Mismatch error.
        # logging.error("GOT A STATE MISSING OR STATE MISMATCH ERROR: %s", e)
        if request.user.is_authenticated:
            return redirect("/")  # TODO (WvdA): where do we go from here?

        # Issue with state, now redirects to microsoft login page, do we want to go to / - home page with an
        # error message telling the user to retry?
        return provider.start_login(request)

    return redirect("/")  # TODO (WvdA): where do we go from here?


#
#
# def sign_out(request):
#     remove_user_and_token(request)  # Azure logout
#     logout(request)  # Django logout
#     return HttpResponseRedirect(settings.LOGOUT_REDIRECT_URL)
