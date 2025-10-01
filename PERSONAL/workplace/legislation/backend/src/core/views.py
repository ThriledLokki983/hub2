# pylint: disable=R0901
from django.shortcuts import render, redirect
from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.functions import send_mail
from core.serializers import ContactFormSerializer


def home(request):
    if request.get_host() == "localhost:8000":
        return redirect("http://localhost:3000")
    return render(request, "core/home.html")


def empty(request):
    return Response({}, status=status.HTTP_200_OK)


class BaseModelViewSet(viewsets.ModelViewSet):
    lookup_field = "identifier"

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        identifier = self.kwargs.get(self.lookup_field)

        if identifier is None:
            raise NotFound("Identifier not provided")

        obj = queryset.filter(**{self.lookup_field: identifier}).first()
        if obj is None:
            raise NotFound("Object with this identifier does not exist")

        self.check_object_permissions(self.request, obj)
        return obj


class BaseListView(ListAPIView):
    lookup_field = "identifier"


class ContactFormView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            context = {
                "subject": serializer.validated_data['subject'],
                "data": {"body": serializer.validated_data['body']},
            }
            from_email = f'{request.user.first_name} {request.user.last_name} <{request.user.email}>'
            send_mail(serializer.validated_data['to'], dict(context), from_email)
            return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
