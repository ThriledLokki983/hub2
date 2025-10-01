"""_
Views for the user API.
"""
from rest_framework import (
    generics,
    authentication,
    permissions,
)
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings

from user.serializers import (
    UserSerializer,
    AuthTokenSerializer,
)


class CreateUserView(generics.CreateAPIView):
    """_
    Create a new user in the system.
    """
    serializer_class = UserSerializer


class CreateTokenView(ObtainAuthToken):
    """_
    Create a new auth token for the user.
    """
    serializer_class = AuthTokenSerializer
    # This is the renderer that will be used to render the
    # browsable API page once the endpoint is accessed.
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class ManageUserView(generics.RetrieveUpdateAPIView):
    """_
    Manage the authenticated user.
    """
    serializer_class = UserSerializer
    # How do we know the user is who he/she is
    authentication_classes = [authentication.TokenAuthentication]
    # What permissions does the user have
    permissions_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """_
        Retrieve and return the authentication user.
        """
        return self.request.user
