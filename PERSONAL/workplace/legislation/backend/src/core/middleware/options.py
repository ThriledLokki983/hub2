from django.http import JsonResponse


class DisableOptionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            custom_response = {
                "results": None,
                "errors": [{"detail": "Method OPTIONS not allowed."}],
            }
            return JsonResponse(custom_response, status=405)
        response = self.get_response(request)
        return response
