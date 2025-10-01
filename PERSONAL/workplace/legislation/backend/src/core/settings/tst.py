# pylint: skip-file
from .base import *
from .includes.public_facing import *
from .includes.sentry import *

DEBUG = True

APP_DOMAIN = "productlegislationnavigator.tst.devcfs.com"

ALLOWED_HOSTS += [APP_DOMAIN]

CORS_ALLOWED_ORIGINS = [
    f"https://{APP_DOMAIN}",
]

OAUTH_CLIENT = {
    "client_id": "urn:xc-middleware.stg.pwcinternal.com",
    "client_secret": "fcNeeDpNIeh3VUn8mmR8",
    "production": False,
    "redirect_uri": "https://xc-middleware.stg.pwcinternal.com/callback/",
    "redirect_uri_override": "https://productlegislationnavigator.tst.devcfs.com/callback/",
    "post_logout_redirect_uri": "",
    "scope": "openid email profile stateorprovince country employeeNumber cloudEmail locality businessunit "
    "windowsaccountname upwcjobtitle pwcPartyID employeetype PwClos pwcWorkerID "
    "organization PwCPPI",
    "whitelist": [],
    "auto_populate_user": True,
}

ENV = "test"

MSAL_REDIRECT_PATH = f"https://{APP_DOMAIN}/msal_callback/"
