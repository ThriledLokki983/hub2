import os

from django.http import JsonResponse

from core.decorators import login_exempt


@login_exempt
def health(_request) -> JsonResponse:
    return JsonResponse({'status': 'HEALTHY', 'commit': os.getenv('GIT_COMMIT_SHA', 'unknown')})
