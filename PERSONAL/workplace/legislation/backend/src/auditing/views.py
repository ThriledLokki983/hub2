# pylint: disable=R0901
from io import BytesIO

import openpyxl
from django.db.models import Q
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response

from auditing.models import AuditLog
from auditing.serializers import AuditingSerializer
from core.views import BaseListView


@extend_schema(tags=["Auditing"])
class AuditingListView(BaseListView):
    serializer_class = AuditingSerializer
    queryset = AuditLog.objects.all()

    def dump(self, results):
        cols = ["Date", "Affected section", "Updated by", "Updated field", "Previous value", "New value", "Action"]
        _wb = openpyxl.Workbook()
        _ws = _wb.active
        _ws.append(cols)
        for result in results:
            dt_with_tz = result.timestamp.astimezone()
            dt_naive = dt_with_tz.replace(tzinfo=None)
            timestamp = dt_naive
            for changes in result.changes:
                record = [
                    timestamp,
                    result.model_name,
                    str(result.user),
                    changes["section"],
                    changes["old_value"],
                    changes["new_value"],
                    result.action
                ]
                _ws.append(record)
        file_stream = BytesIO()
        _wb.save(file_stream)
        file_stream.seek(0)
        response = HttpResponse(file_stream,
                                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="output.xlsx"'
        return response

    def get_queryset(self):
        """
        Usage of filtering:
        For example: Legislation with id 1 the URL will look like:
        http://domain/api/v1/auditing/<identifier>/

        Filter on changed field will look like:
        /api/v1/auditing/<identifier>/?preparation_state=IN_REVIEW
        This will query all changes were the new value equals IN_REVIEW

        Filter on timestamp field will look like:
        /api/v1/auditing/<identifier>/?timestamp__start=2024-06-08&timestamp__end=2024-07-09
        This will query a range of timestamps on the auditlog object

        Filter on user field will look like:
        /api/v1/auditing/<identifier>/?user__email=canberk.x.hallik@pwc.com
        This will query a user object where the email matchets

        All items are concatenated with AND constructors.

        If you want to query the old values then use ref=old in the querystring
        """
        identifier = self.kwargs.get("identifier")
        results = AuditLog.objects.select_related("user").filter(
            identifier=identifier
        )
        if self.request.GET:
            ref = self.request.GET.get("ref", "new")
            filters = Q()
            for key, value in self.request.GET.items():
                if key not in ["ref", "download"]:
                    if key.startswith("timestamp") or key.startswith("user"):
                        if key == "timestamp__start":
                            start_date = self.request.GET.get("timestamp__start")
                            end_date = self.request.GET.get("timestamp__end", start_date)
                            filters &= Q(Q(timestamp__gte=start_date) & Q(timestamp__lte=end_date))
                        elif key == "timestamp__end":
                            pass
                        else:
                            filter_key = f"{key}"
                            filters &= Q(**{filter_key: value})
                    else:
                        filter_key = f"changes__{key}__{ref}_value"
                        if value == "false":
                            value = False
                        elif value == "true":
                            value = True
                        filters &= Q(**{filter_key: value})
            return results.filter(filters)
        return results

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if 'download' in request.GET:
            return self.dump(queryset)
        if not queryset.exists():
            response_data = {"results": [], "errors": [{"detail": "Not found."}]}
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        response_data = {"results": serializer.data, "errors": []}
        return Response(response_data, status=status.HTTP_200_OK)
