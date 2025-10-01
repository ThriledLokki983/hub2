# pylint: skip-file
from .base import *
from .includes.public_facing import *
from .includes.sentry import *

DEBUG = False

APP_DOMAIN = "sustainabilitylegislationnavigator.pwc.com"

ALLOWED_HOSTS += [APP_DOMAIN]

OAUTH_CLIENT = {
    "client_id": os.environ.get('OAUTH_CLIENT_ID', ""),
    "client_secret": os.environ.get('OAUTH_CLIENT_SECRET', ""),
    "production": True,
    "redirect_uri": "https://sustainabilitylegislationnavigator.pwc.com/callback/",
    "redirect_uri_override": "",
    "post_logout_redirect_uri": "",
    "scope": "openid email profile organization",
    "whitelist": [],
    "auto_populate_user": True,
}

ENV = "prod"

CORS_ALLOWED_ORIGINS = [
    f"https://{APP_DOMAIN}",
]

MSAL_REDIRECT_PATH = f"https://{APP_DOMAIN}/msal_callback/"
