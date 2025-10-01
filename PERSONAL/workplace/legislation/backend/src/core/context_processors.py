from django.conf import settings


def static_vars(request):
    return {
    }


def urls(request):
    return {'frontend_url': settings.URL_FRONTEND, 'backend_url': settings.URL_BACKEND}
