"""_
Test Tag API.
"""
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Tag

from recipe.serializers import TagSerializer


TAGS_URL = reverse('recipe:tag-list')


def detail_url(tag_id):
    """_
    Return tag detail URL.
    """
    return reverse('recipe:tag-detail', args=[tag_id])


def create_user(email="user@example.com", password="example123"):
    """_
    Create and return a new user.
    """
    return get_user_model().objects.create_user(email=email, password=password)


class PublicTagAPITests(TestCase):
    """_
    Test the publicly available Tag API.
    """
    def setUp(self):
        """_
        Create client for testing.
        """
        self.client = APIClient()

    def test_auth_required(self):
        """_
        Test that auth is required for retrieving tags.
        """
        print("test_auth_required")
        response = self.client.get(TAGS_URL)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTagAPITests(TestCase):
    """_
    Test the authorized user Tag API.
    """
    def setUp(self):
        """_
        Create client and user for testing.
        """
        self.user = get_user_model().objects.create_user(
            email="test@email.com",
            password="example123",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_tags(self):
        """_
        Test retrieving tags.
        """
        print("test_retrieve_tags")
        Tag.objects.create(user=self.user, name='Vegan')
        Tag.objects.create(user=self.user, name='Dessert')

        response = self.client.get(TAGS_URL)

        tags = Tag.objects.all().order_by('-name')
        serializer = TagSerializer(tags, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_tags_limited_to_user(self):
        """_
        Test that tags returned are for the authenticated user.
        """
        print("test_tags_limited_to_user")
        user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            password='example123',
        )

        Tag.objects.create(user=user2, name='Fruity')
        tag = Tag.objects.create(user=self.user, name='Comfort Food')

        response = self.client.get(TAGS_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], tag.name)
        self.assertEqual(str(response.data[0]['id']), str(tag.id))

    def test_update_tag_successful(self):
        """_
        Test updating a tag with patch.
        """
        print("test_update_tag_successful")
        tag = Tag.objects.create(user=self.user, name='After Dinner')

        payload = {'name': 'Desert Time'}
        url = detail_url(tag.id)
        response = self.client.patch(url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tag.refresh_from_db()
        self.assertEqual(tag.name, payload['name'])

    def test_delete_tag(self):
        """_
        Test deleting a tag.
        """
        print("test_delete_tag")
        tag = Tag.objects.create(user=self.user, name='After Dinner')

        url = detail_url(tag.id)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        tags = Tag.objects.filter(user=self.user, name=tag.name)
        self.assertFalse(tags.exists())
