import base64
import json
from datetime import date, datetime

from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.utils import timezone
from rest_framework import serializers

from profiles.models import Profile
from .models import AuditLog


class CustomJSONEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, models.Model):
            # Manually serialize model fields
            field_dict = {}
            for field in o._meta.fields:
                value = getattr(o, field.name)
                # Check for fields that need special handling, e.g., DateFields
                if isinstance(value, (date, datetime)):
                    field_dict[field.name] = value.isoformat()
                elif isinstance(value, bytes):  # Handle binary data
                    # Convert binary data to base64 string
                    field_dict[field.name] = base64.b64encode(value).decode("utf-8")
                else:
                    field_dict[field.name] = value
            return field_dict
        return super().default(o)


def serialize_instance(instance):
    # Use the custom JSON encoder to serialize the instance
    serialized_data = json.dumps(instance, cls=CustomJSONEncoder)
    return serialized_data


def serialize_related_instance(related_instance):
    # Use model_to_dict to serialize fields, excluding many-to-many and related objects
    # Serialize the instance to JSON and then load it back into a dictionary
    json_data = serialize("json", [related_instance])
    related_data_list = json.loads(json_data)
    related_data = related_data_list[0]["fields"]

    # Manually handle the serialization of DateTimeFields
    for field_name, field_value in related_data.items():
        if isinstance(field_value, str):
            try:
                parsed_date = timezone.datetime.strptime(field_value, "%Y-%m-%dT%H:%M:%S.%fZ")
                if timezone.is_aware(parsed_date):
                    parsed_date = timezone.localtime(parsed_date)
                related_data[field_name] = parsed_date.strftime("%Y-%m-%dT%H:%M:%S")
            except ValueError:
                # If the value isn't a datetime string, we can ignore it
                pass

    return related_data


class StrippedProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['identifier', 'username', 'first_name', 'last_name', 'email', 'initials', 'user_permissions']


class AuditingSerializer(serializers.ModelSerializer):
    user = StrippedProfileSerializer(read_only=True)

    class Meta:
        model = AuditLog
        fields = ["identifier", "action", "user", "timestamp", "changes"]
        read_only_fields = ["id"]
