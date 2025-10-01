from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from sso.msal_views import callback
from sso.views import LoginView, login_test, login_test_fail

urlpatterns = [
    # path('', views.home, name='home'),
    # path('calendar', views.home, name='calendar'),
    # path('signin', views.sign_in, name='signin'),
    # path('signout', views.sign_out, name='signout'),
    # path('callback', views.callback, name='callback'),
    path("_/msal_test_login/", login_test, name="msal_test_login"),  # TODO (WvdA): Remove after test
    path("login-fail/", login_test_fail, name="login-fail"),  # TODO (WvdA): Remove after test
    path("_/init_login", LoginView.as_view(), name="login"),
    path("msal_callback/<str:sso_settings>/", callback, name="msal_callback"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
