from typing import Callable

from django.conf import settings
from django.db import connection
from django.http import HttpRequest, HttpResponse


class QueryCountMiddleware:  # pylint: disable=too-few-public-methods
    def __init__(self, get_response: Callable):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        result = self.get_response(request)

        if settings.SHOW_QUERY_INFO:
            for query in connection.queries:
                print(query.get('sql', '-'))

        if settings.SHOW_QUERY_TIME:
            print(f"{len(connection.queries)} queries run,"
                  f" total {sum(float(_q.get('time', None)) for _q in connection.queries):.3f} seconds")

        return result
