# pylint: skip-file
from .base import *

DEBUG = True

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DATABASES["default"]["OPTIONS"].pop("ssl")

OAUTH_CLIENT = {
    "client_id": "urn:productlegislationnavigator.stg.devcfs.com",
    "client_secret": "9J6Xi3R0nXP7cdcqRIPv",
    "production": False,
    "redirect_uri": "https://productlegislationnavigator.stg.devcfs.com/callback/",
    "redirect_uri_override": "http://localhost:8000/callback/",
    "post_logout_redirect_uri": "",
    "scope": "openid email profile organization",
    "whitelist": [],
    "auto_populate_user": True,
}

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "[::1]",
    "0.0.0.0",
]

ENV = "dev"

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
]

SESSION_COOKIE_AGE = 9000

MIDDLEWARE.append('core.middleware.query_count.QueryCountMiddleware')
SHOW_QUERY_INFO = os.environ.get('QUERY_COUNT_MIDDLEWARE_INFO') in ["true", "True"]
SHOW_QUERY_TIME = os.environ.get('QUERY_COUNT_MIDDLEWARE_TIME') in ["true", "True"]

MSAL_REDIRECT_PATH = "http://localhost:8000/msal_callback/"
URL_FRONTEND = "http://localhost:3000/"
URL_BACKEND = "http://localhost:8000/"
