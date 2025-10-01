"""_
Test the recipe API.
"""
from decimal import Decimal
import tempfile
import os

from PIL import Image

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import (
    Recipe,
    Tag,
    Ingredient,
)
from recipe.serializers import (
    RecipeSerializer,
    RecipeDetailSerializer,
)


RECIPE_URL = reverse('recipe:recipe-list')
ORDER_BY_ID = '-id'


def detail_url(recipe_id):
    """_
    Return recipe detail URL.
    """
    return reverse('recipe:recipe-detail', args=[recipe_id])


def image_upload_url(recipe_id):
    """_
    Return URL for recipe image upload.
    """
    return reverse('recipe:recipe-upload-image', args=[recipe_id])


def create_recipe(user, **params):
    """_
    Create and return a new recipe.
    """
    defaults = {
        'title': 'Sample Recipe',
        'time_minutes': 25,
        'price': Decimal('10.99'),
        'description': 'Sample recipe description',
        'link': 'https://example.com/recipe',
    }
    defaults.update(params)

    return Recipe.objects.create(user=user, **defaults)


def create_user(**params):
    """_
    Create and return a new user.
    """
    return get_user_model().objects.create_user(**params)


class PublicRecipeAPITests(TestCase):
    """_
    Test the publicly available recipe API.
    """
    def setUp(self):
        """_
        Create client for testing.
        """
        self.client = APIClient()

    def test_auth_required(self):
        """_
        Test that login is required for retrieving recipes.
        """
        response = self.client.get(RECIPE_URL)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateRecipeAPITests(TestCase):
    """_
    Test the authorized user recipe API.
    """
    def setUp(self):
        """_
        Create client and user for testing.
        """
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email='testuser@example.come',
            password='example123',
        )
        self.user = get_user_model().objects.create_user(
            'user@example.com',
            'example123',
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_recipes(self):
        """_
        Test retrieving recipes.
        """
        print('test_retrieve_recipes')
        create_recipe(user=self.user)
        create_recipe(user=self.user)

        response = self.client.get(RECIPE_URL)

        recipes = Recipe.objects.all().order_by(ORDER_BY_ID)
        serializer = RecipeSerializer(recipes, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_recipes_limited_to_user(self):
        """_
        Test retrieving recipes for user.
        """
        print('test_recipes_limited_to_user')
        user2 = create_user(
            email='user2@example.com',
            password='test123',
        )

        create_recipe(user=user2)
        create_recipe(user=self.user)

        response = self.client.get(RECIPE_URL)

        recipes = Recipe.objects.filter(user=self.user)
        serializer = RecipeSerializer(recipes, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_view_recipe_detail(self):
        """_
        Test viewing a recipe detail.
        """
        print('test_view_recipe_detail')
        recipe = create_recipe(user=self.user)
        # recipe.tags.add(Tag.objects\
        # .create(user=self.user, name='Vegan'))
        # recipe.tags.add(Tag.objects\
        # .create(user=self.user, name='Dessert'))

        url = detail_url(recipe.id)
        response = self.client.get(url)

        serializer = RecipeDetailSerializer(recipe)
        self.assertEqual(response.data, serializer.data)

    def test_create_recipe(self):
        """_
        Test creating a recipe.
        """
        print('test_create_recipe')
        payload = {
            'title': 'Chocolate Cheesecake',
            'time_minutes': 30,
            'price': Decimal('5.99'),
        }
        response = self.client.post(RECIPE_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        recipe = Recipe.objects.get(id=response.data['id'])
        for key, value in payload.items():
            self.assertEqual(getattr(recipe, key), value)
        self.assertEqual(recipe.user, self.user)

    def test_partial_update(self):
        """_
        Test updating a recipe with patch.
        """
        print('test_partial_update')
        original_link = 'https://example.com/recipe'
        recipe = create_recipe(
            user=self.user,
            link=original_link,
            title='Original Title',
        )

        payload = {'title': 'New Title'}
        url = detail_url(recipe.id)
        response = self.client.patch(url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recipe.refresh_from_db()
        self.assertEqual(recipe.title, payload['title'])
        self.assertEqual(recipe.link, original_link)
        self.assertEqual(recipe.user, self.user)

    def test_full_update(self):
        """_
        Test updating a recipe with put.
        """
        print('test_full_update')
        recipe = create_recipe(
            user=self.user,
            title='Sample Original Title',
            link='https://example.com/recipe',
            description='Sample Original description',
        )
        payload = {
            'title': 'New Title',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'link': 'https://example.com/recipe',
            'description': 'New description',
        }
        url = detail_url(recipe.id)
        response = self.client.put(url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recipe.refresh_from_db()
        for key, value in payload.items():
            self.assertEqual(getattr(recipe, key), value)
        self.assertEqual(recipe.user, self.user)

    def test_update_user_returns_error(self):
        """_
        Test that updating the user returns an error.
        """
        print('test_update_user_returns_error')
        new_user = create_user(
            email='newuser@example.com',
            password='example123',
        )
        recipe = create_recipe(
            user=self.user,
            title='Sample Original Title',
            link='https://example.com/recipe',
            description='Sample Original description',
        )
        payload = {
            'user': new_user,
            'title': 'New Title',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'link': 'https://example.com/recipe',
            'description': 'New description',
        }
        url = detail_url(recipe.id)
        self.client.patch(url, payload)

        recipe.refresh_from_db()
        self.assertEqual(recipe.user, self.user)

    def test_delete_recipe(self):
        """_
        Test deleting a recipe.
        """
        print('test_delete_recipe')
        recipe = create_recipe(
            user=self.user,
            title='Sample Original Title',
            link='https://example.com/recipe',
            description='Sample Original description',
        )
        url = detail_url(recipe.id)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Recipe.objects.count(), 0)
        self.assertFalse(Recipe.objects.filter(id=recipe.id).exists())

    def test_delete_recipe_other_users_recipe_error(self):
        """_
        Test that a user cannot update another user's recipe.
        """
        print('test_delete_recipe_other_users_recipe_error')
        user2 = create_user(
            email='cannotdelete@example.com',
            password='example123',
        )
        recipe = create_recipe(user=user2)

        url = detail_url(recipe.id)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Recipe.objects.filter(id=recipe.id).exists())

    def test_create_recipe_with_new_tags(self):
        """_
        Test creating a recipe with tags.
        """
        print('test_create_recipe_with_tags')
        payload = {
            'title': 'Chocolate Cheesecake',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'tags': [{'name': 'Thai'}, {'name': 'Dessert'}],
        }
        response = self.client.post(RECIPE_URL, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        recipes = Recipe.objects.filter(user=self.user)
        recipe = recipes.first()
        self.assertEqual(recipes.count(), 1)
        self.assertEqual(recipe.tags.count(), 2)
        recipe = recipes.first()
        for tag in payload['tags']:
            exists = recipe.tags.filter(
                name=tag['name'],
                user=self.user,
            ).exists()
            self.assertTrue(exists)

    def test_create_recipe_with_existing_tags(self):
        """_
        Test creating a recipe with existing tags.
        """
        print('test_create_recipe_with_existing_tags')
        tag_indian = Tag.objects.create(user=self.user, name='Indian')
        payload = {
            'title': 'Chocolate Cheesecake',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'tags': [{'name': 'Indian'}, {'name': 'Breakfast'}],
        }

        response = self.client.post(RECIPE_URL, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        recipes = Recipe.objects.filter(user=self.user)
        self.assertEqual(recipes.count(), 1)
        recipe = recipes.first()
        self.assertEqual(recipe.tags.count(), 2)
        self.assertIn(tag_indian, recipe.tags.all())
        for tag in payload['tags']:
            exists = recipe.tags.filter(
                name=tag['name'],
                user=self.user,
            ).exists()
            self.assertTrue(exists)

    def test_create_tag_on_update(self):
        """_
        Test creating a tag on update.
        """
        print('test_create_tag_on_update')
        recipe = create_recipe(user=self.user)
        payload = {
            'title': 'Chocolate Cheesecake',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'tags': [{'name': 'Indian'}, {'name': 'Breakfast'}],
        }

        url = detail_url(recipe.id)
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        new_tag = Tag.objects.get(user=self.user, name='Breakfast')
        self.assertIn(new_tag, recipe.tags.all())

    def test_update_recipe_assign_tag(self):
        """_
        Test updating a recipe with assigning a tag.
        """
        print('test_update_recipe_assign_tag')
        tag_breakfast = Tag.objects.create(user=self.user, name='Breakfast')
        recipe = create_recipe(user=self.user)
        recipe.tags.add(tag_breakfast)

        tag_lunch = Tag.objects.create(user=self.user, name='Lunch')
        payload = {
            'title': 'Chocolate Cheesecake',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'tags': [{'name': 'Lunch'}],
        }
        url = detail_url(recipe.id)
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(tag_lunch, recipe.tags.all())
        self.assertNotIn(tag_breakfast, recipe.tags.all())

    def test_clear_recipe_tags(self):
        """_
        Test clearing recipe tags.
        """
        print('test_clear_recipe_tags')
        tag = Tag.objects.create(user=self.user, name='Breakfast')
        recipe = create_recipe(user=self.user)
        recipe.tags.add(tag)

        payload = {
            'title': 'Chocolate Cheesecake',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'tags': [],
        }
        url = detail_url(recipe.id)
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(recipe.tags.count(), 0)

    def test_create_recipe_with_new_ingredient(self):
        """
        Test creating recipe with new ingredient
        """
        payload = {
            'title': 'Test Recipe',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'ingredients': [{'name': 'Cabbage'}, {'name': 'Carrot'}],
        }

        response = self.client.post(RECIPE_URL, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        recipes = Recipe.objects.filter(user=self.user)
        self.assertTrue(recipes.count(), 1)
        ingredients = recipes[0].ingredients.all()
        self.assertEqual(ingredients.count(), 2)
        for ingredient in payload['ingredients']:
            self.assertTrue(recipes[0].ingredients.filter(
                name=ingredient['name'],
                user=self.user).exists()
            )

    def test_create_recipe_with_existing_ingredient(self):
        """
        Test creating recipe with existing ingredient
        """
        ingredient = Ingredient.objects.create(user=self.user, name='Cabbage')
        payload = {
            'title': 'Vietnamese Spring Rolls',
            'time_minutes': 30,
            'price': Decimal('5.99'),
            'ingredients': [{'name': 'Cabbage'}, {'name': 'Carrot'}],
        }

        response = self.client.post(RECIPE_URL, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        recipes = Recipe.objects.filter(user=self.user)
        self.assertTrue(recipes.count(), 1)
        ingredients = recipes[0].ingredients.all()
        self.assertEqual(ingredients.count(), 2)
        self.assertIn(ingredient, ingredients)
        for ingredient in payload['ingredients']:
            self.assertTrue(recipes[0].ingredients.filter(
                name=ingredient['name'],
                user=self.user).exists()
            )

    def test_create_ingredient_on_update(self):
        """
        Test creating an ingredient when user updates recipe
        """
        recipe = create_recipe(user=self.user)

        payload = {'ingredients': [{'name': 'Cabbage'}, {'name': 'Carrot'}]}
        url = detail_url(recipe.id)
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        new_ingredient = Ingredient.objects.get(user=self.user, name='Carrot')
        self.assertIn(new_ingredient, recipe.ingredients.all())
        self.assertEqual(recipe.ingredients.count(), 2)

    def test_update_recipe_assign_ingredient(self):
        """
        Test assigning an existing ingredient to a recipe
        """
        ingredient1 = Ingredient.objects.create(user=self.user, name='Cabbage')
        recipe = create_recipe(user=self.user)
        recipe.ingredients.add(ingredient1)

        ingredient2 = Ingredient.objects.create(user=self.user, name='Carrot')
        payload = {'ingredients': [{'name': 'Carrot'}]}
        url = detail_url(recipe.id)
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(ingredient2, recipe.ingredients.all())
        self.assertNotIn(ingredient1, recipe.ingredients.all())
        self.assertEqual(recipe.ingredients.count(), 1)

    def test_clear_recipe_ingredients(self):
        """
        Test clearing recipe ingredients
        """
        ingredient = Ingredient.objects.create(user=self.user, name='Cabbage')
        recipe = create_recipe(user=self.user)
        recipe.ingredients.add(ingredient)

        payload = {'ingredients': []}
        url = detail_url(recipe.id)
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(recipe.ingredients.count(), 0)


class RecipeImageUploadTests(TestCase):
    """_
    Test uploading image to recipe.
    """
    def setUp(self):
        """_
        Create client and user for testing.
        """
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email='user@test.com',
            password='test123',
        )

        self.client.force_authenticate(self.user)
        self.recipe = create_recipe(user=self.user)

    def tearDown(self):
        """_
        Remove test files.
        """
        self.recipe.image.delete()

    def test_upload_image_to_recipe(self):
        """_
        Test uploading an image to recipe.
        """
        print('test_upload_image_to_recipe')
        url = image_upload_url(self.recipe.id)
        with tempfile.NamedTemporaryFile(suffix='.jpg') as file:
            image = Image.new('RGB', (10, 10))
            image.save(file, format='JPEG')
            file.seek(0)
            payload = {'image': file}
            response = self.client.post(url, payload, format='multipart')

        self.recipe.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('image', response.data)
        self.assertTrue(os.path.exists(self.recipe.image.path))

    def test_upload_image_bad_request(self):
        """_
        Test uploading an invalid image.
        """
        print('test_upload_image_bad_request')
        url = image_upload_url(self.recipe.id)
        payload = {'image': 'notimage'}
        response = self.client.post(url, payload, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
