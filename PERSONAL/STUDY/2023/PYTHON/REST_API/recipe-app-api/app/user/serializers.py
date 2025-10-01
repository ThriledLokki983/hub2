"""_
Serializers for user API View.
"""
from django.contrib.auth import (
    get_user_model,
    authenticate,
)
from django.utils.translation import gettext as _

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """_
    Serializer for the user object.
    """
    class Meta:
        # The model (User) that the serializer is for and the
        # fields that should be included in the serializer
        # as well as any extra keyword arguments that should be
        # passed to the model serializer.
        model = get_user_model()
        fields = ['email', 'password', 'name']
        # write_only means that the field is only used for creating or
        # updating an object and is not returned when the serializer
        # is serialized.
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8, }}

    def create(self, validated_data):
        """_
        Create a new user with encrypted password and return it.
        This is only called after a successful validation.
        """
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """_
         Update a user, setting the password correctly and return it.
        """
        password = validated_data.pop('password', None)
        # super() calls the ModelSerializer's update() method.
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()
        return user


class AuthTokenSerializer(serializers.Serializer):
    """_
    Serializer for the user authentication token.
    """
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password', },
        trim_whitespace=False,
    )

    def validate(self, attrs):
        """_
        Validate and authenticate the user.
        """
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )
        if not user:
            msg = _('Unable to authenticate with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
