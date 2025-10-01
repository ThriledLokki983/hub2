from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None and response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        retry_after = round(int(response.headers.get("Retry-After", None)) / 60)
        error_message = f"You have exceeded the allowed number of requests. Available in {retry_after} minutes."
        custom_response = {
            "results": None,
            "errors": [{"detail": error_message}],
        }

        return Response(custom_response, status=status.HTTP_429_TOO_MANY_REQUESTS)

    if response is not None and response.status_code == status.HTTP_403_FORBIDDEN:
        custom_response = {
            "results": None,
            "errors": [{"detail": "You do not have permission to perform this action."}],
        }
        return Response(custom_response, status=status.HTTP_403_FORBIDDEN)

    if response is not None and response.status_code == status.HTTP_404_NOT_FOUND:
        custom_response = {
            "results": None,
            "errors": [{"detail": "Object with this identifier does not exist."}],
        }
        return Response(custom_response, status=status.HTTP_404_NOT_FOUND)

    return response
