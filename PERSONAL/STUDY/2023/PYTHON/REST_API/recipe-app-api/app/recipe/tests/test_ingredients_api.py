"""
Tests for the Ingredients API
"""

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Ingredient

from recipe.serializers import IngredientSerializer

INGREDIENT_URL = reverse('recipe:ingredient-list')


def detail_url(ingredient_id):
    """Return ingredient detail URL"""
    return reverse('recipe:ingredient-detail', args=[ingredient_id])


def create_user(email='test@user.com', password='testpass1234'):
    """Create and return a user"""
    return get_user_model().objects.create_user(email=email, password=password)


class PublicIngredientsApiTest(TestCase):
    """
    Test unauthenticated API Requests
    """
    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """
        Test that authentication is required for retrieving ingredients
        """
        response = self.client.get(INGREDIENT_URL)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateIngredientApiTest(TestCase):
    """
    Test authenticated API Requests
    """
    def setUp(self):
        self.client = APIClient()
        self.user = create_user()
        self.client.force_authenticate(self.user)

    def test_retrieve_ingredients_list(self):
        """
        Test retrieving a list of ingredients
        """
        print('test_retrieve_ingredients_list')
        Ingredient.objects.create(user=self.user, name='Kale')
        Ingredient.objects.create(user=self.user, name='Salt')

        response = self.client.get(INGREDIENT_URL)

        ingredients = Ingredient.objects.all().order_by('-name')
        serializer = IngredientSerializer(ingredients, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_ingredients_limited_to_user(self):
        """
        Test that ingredients returned are for the authenticated user
        """
        print('test_ingredients_limited_to_user')
        user2 = create_user(email='user2@test.com', password='testpass1234')
        Ingredient.objects.create(user=user2, name='Vinegar')
        ingredient = Ingredient.objects.create(user=self.user, name='Tumeric')

        response = self.client.get(INGREDIENT_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], ingredient.name)
        self.assertEqual(str(response.data[0]['id']), str(ingredient.id))

    def test_update_ingredient(self):
        """
        Test updating an ingredient
        """
        print('test_update_ingredient')
        ingredient = Ingredient.objects.create(user=self.user, name='Vinegar')

        payload = {'name': 'Apple Cider Vinegar'}
        url = detail_url(ingredient.id)
        response = self.client.patch(url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ingredient.refresh_from_db()
        self.assertEqual(ingredient.name, payload['name'])

    def test_delete_ingredient(self):
        """
        Test deleting an ingredient
        """
        print('test_delete_ingredient')
        ingredient = Ingredient.objects.create(user=self.user, name='Lettuce')

        url = detail_url(ingredient.id)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Ingredient.objects.filter(id=ingredient.id).exists())
