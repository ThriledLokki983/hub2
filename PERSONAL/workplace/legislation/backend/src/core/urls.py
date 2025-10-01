"""productlegislationnavigator URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path

from core import views
from core.health import health
from core.views import ContactFormView
from sso.urls import urlpatterns as sso_urlpatterns


def trigger_error(request):
    division_by_zero = 1 / 0
    print(division_by_zero)


urlpatterns = [
    path("", views.home),
    path("sentry-debug/", trigger_error),
    path("account/login", views.empty),
    # path("callback/login/", pwc_sso.views.login_callback, name="sso_callback"),
    path("api/v1/navigator/", include("navigator.urls")),
    path("api/v1/profiles/", include("profiles.urls")),
    path("api/v1/auditing/", include("auditing.urls")),
    path("api/v1/client/", include("client.urls")),
    path("api/v1/contact/", ContactFormView.as_view(), name="contact"),
    path("_/healthz", health),
    path("_/ec_admin/", admin.site.urls),
]

urlpatterns += sso_urlpatterns
