import logging

import sentry_sdk
from django.conf import settings
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.logging import LoggingIntegration


# Ignore specific events.
def before_send(event, hint):
    # Ignore everything from `/_/healthz`.
    if '/healthz' in event.get('transaction', ''):
        return None
    return event


# See: https://docs.sentry.io/platforms/python/guides/logging/
sentry_logging = LoggingIntegration(
    level=logging.INFO,
    event_level=logging.ERROR,
)


# See: https://docs.sentry.io/platforms/python/
sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    environment=settings.ENV,
    integrations=[DjangoIntegration(), sentry_logging],
    before_send=before_send,
    traces_sample_rate=(0 if settings.ENV != 'prd' else 0.05),
    send_default_pii=True,
)


# Tags, see: https://docs.sentry.io/platforms/python/guides/django/enriching-events/tags/
# sentry_sdk.set_tag('instance', os.environ.get('INSTANCE', ''))
