"""_
Test for Models.
"""
from unittest.mock import patch
from decimal import Decimal

from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


def create_user(user="user@example.com", password="example123"):
    """_
    Create and return a new user.
    """
    return get_user_model().objects.create_user(user, password)


class ModelTests(TestCase):
    """_
    Test for Models.
    """
    def test_create_user_with_email_successful(self):
        """_
        Test creating a new user with an email is successful.
        """
        email = 'test@example.com'
        password = 'example123'
        user = get_user_model().objects.create_user(
            email=email,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """_
        Test the email for a new user is normalized.
        """
        sample_emails = [
            ['test1@EXAMPLE.Com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com'],
            ['TEST3@EXAMPLE.COM', 'TEST3@example.com'],
            ['test4@example.COM', 'test4@example.com'],
        ]
        for email, expected in sample_emails:
            user = get_user_model().objects.create_user(
                email=email,
                password='example123',
            )
            # email[1] is the normalized email
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        """_
        Test creating user without an email raises ValueError.
        """
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                email=None,
                password='example123',
            )

    def test_create_new_superuser(self):
        """_
        Test creating a new superuser.
        """
        user = get_user_model().objects.create_superuser(
            'test@example.com',
            'example123',
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_recipe(self):
        """_
        Test creating a recipe is successful.
        """
        user = get_user_model().objects.create_user(
            email="test@example.com",
            password="example123",
        )
        recipe = models.Recipe.objects.create(
            user=user,
            title="Test recipe",
            time_minutes=5,
            price=Decimal('10.50'),
            description="Sample recipe description",
        )

        self.assertEqual(str(recipe), recipe.title)

    def test_create_tag(self):
        """_
        Create and return a new tag.
        """
        tag = models.Tag.objects.create(
            user=create_user(),
            name="Tag1",
        )

        self.assertEqual(str(tag), tag.name)

    def test_ingredient(self):
        """
        Test Ingredient creation is successful
        """
        user = create_user()
        ingredient = models.Ingredient.objects.create(
            user=user,
            name='Ingredient'
        )

        self.assertEqual(str(ingredient), ingredient.name)

    @patch('core.models.uuid.uuid4')
    def test_recipe_file_name_uuid(self, mock_uuid):
        """_
        Test that image is saved in the correct location.
        """
        print('test_recipe_file_name_uuid')
        uuid = 'test-uuid'
        mock_uuid.return_value = uuid
        file_path = models.recipe_image_file_path(None, 'recipe.jpg')

        expected_path = f'uploads/recipe/{uuid}.jpg'
        self.assertEqual(file_path, expected_path)
