from django.shortcuts import redirect, render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from client.models import Client
from core.decorators import login_exempt
from sso.login import PwCSSO, get_provider


@login_exempt
def login_test(request):
    # TODO (WvdA): This few should be replaced in the frontend - Design AEB-331
    #  https://pwc-nl-adv-experienceconsulting.atlassian.net/browse/AEB-331
    return render(request, "sso/tmp_login.html")


@login_exempt
def login_test_fail(request):
    # TODO (WvdA): This few should be replaced in the frontend - Design AEB-331
    #  https://pwc-nl-adv-experienceconsulting.atlassian.net/browse/AEB-331
    return redirect("login-fail")


@method_decorator([csrf_exempt, login_exempt], name="dispatch")
class LoginView(View):
    @staticmethod
    def post(request):
        email = request.POST.get("email", "")

        _parts = email.lower().split("@")
        if not len(_parts) == 2:
            if request.get_host() == "localhost:8000":
                redirect("login-fail")
            return redirect("login-fail")  # TODO (WvdA): Redirect to SSO fail page

        try:
            sso_type = Client.objects.get(domain=_parts[1]).sso_settings
            provider = get_provider(sso_type)
            return provider.start_login(request)
        except Client.DoesNotExist:
            # Domain could not be matched to a known client
            if request.get_host() == "localhost:8000":
                redirect("login-fail")
            return redirect("login-fail")  # TODO (WvdA): Redirect to SSO fail page
        except ValueError:
            # The Client does not contain valid SSO configuration
            if request.get_host() == "localhost:8000":
                redirect("login-fail")
            return redirect("login-fail")  # TODO (WvdA): Redirect to SSO fail page

    @staticmethod
    def get(request):
        return PwCSSO("PwC", {}).start_login(request)
