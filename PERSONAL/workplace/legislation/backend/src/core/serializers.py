from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers


class IdentifierRelatedField(serializers.RelatedField):
    def to_internal_value(self, data):
        try:
            return self.get_queryset().get(identifier=data)
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(f"Object with identifier {data} does not exist. Details: {e}")

    def to_representation(self, value):
        return value.identifier


class UUIDRelatedField(serializers.Field):
    def __init__(self, queryset, related_serializer_class, **kwargs):
        self.queryset = queryset
        self.related_serializer_class = related_serializer_class
        super().__init__(**kwargs)

    def to_representation(self, value):
        serializer = self.related_serializer_class(value, many=True, context=self.context)
        return serializer.data

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError("Expected a list of UUIDs")
        related_objects = []
        for uuid in data:
            try:
                obj = self.queryset.get(identifier=uuid)
                related_objects.append(obj)
            except self.queryset.model.DoesNotExist as e:
                raise serializers.ValidationError(f"Object with identifier {uuid} does not exist. Details: {e}")
        return related_objects


class ContactFormSerializer(serializers.Serializer):
    to = serializers.EmailField()
    subject = serializers.CharField(max_length=255)
    body = serializers.CharField()

    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        raise NotImplementedError('Update method is not implemented for this serializer')
