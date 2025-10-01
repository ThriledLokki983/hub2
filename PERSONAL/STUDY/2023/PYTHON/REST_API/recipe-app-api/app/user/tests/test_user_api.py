"""_
Test for the user API endpoints.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status


CREATE_USER_URL = reverse('user:create')
TOKEN_URL = reverse('user:token')
ME_URL = reverse('user:me')


def create_user(**params):
    """_
    Helper function to create and return a new user.
    """
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """_
    Test public features of the user API.
    """
    def setUp(self):
        """_
        Create a client for testing.
        """
        self.client = APIClient()

    def test_create_valid_user_success(self):
        """_
        Test creating user with valid payload is successful.
        """
        payload = {
            'email': 'test@example.com',
            'password': 'example123',
            'name': 'Test Name',
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        # Check that the user was created
        user = get_user_model().objects.get(email=payload['email'])
        self.assertTrue(user.check_password(payload['password']))
        # Check that the password was not returned in the response
        self.assertNotIn('password', res.data)

    def test_user_exists(self):
        """_
        Test creating user that already exists fails.
        """
        payload = {
            'email': 'test@sxample.com',
            'password': 'example123',
            'name': 'Test Name',
        }
        create_user(**payload)
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short(self):
        """_
        Test that password must be more than 5 characters.
        """
        payload = {
            'email': 'userNotExist@example.com',
            'password': 'pw',
            'name': 'Test Name',
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # Check that the user was not created
        user_exists = get_user_model().objects.filter(
            email=payload['email'],
        ).exists()
        self.assertFalse(user_exists)

    def test_create_token_for_user(self):
        """_
        Test that a token is created for the user.
        """
        user_details = {
            'email': 'test@example.com',
            'password': 'example123',
            'name': 'Test Name',
        }
        create_user(**user_details)

        payload = {
            'email': user_details['email'],
            'password': user_details['password']
        }
        res = self.client.post(TOKEN_URL, payload)

        self.assertIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_token_invalid_credentials(self):
        """_
        Test that token is not created if invalid credentials are given.
        """
        user_details = {
            'email': 'test@example.com',
            'password': 'example123',
            'name': 'Test Name',
        }
        create_user(**user_details)

        payload = {
            'email': user_details['email'],
            'password': 'wrong_password',
        }
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_blank_password(self):
        """_
        Test that token is not created if password is blank.
        """
        payload = {
            'email': 'test@example.com',
            'password': '',
            'name': 'Test Name',
        }
        create_user(**payload)
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def retrieve_user_unauthorized(self):
        """_
        Test that authentication is required for users.
        """
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateUserApiTests(TestCase):
    """_
    Test API requests that require authentication.
    """
    def setUp(self):
        """_
        Create a client for testing and a user to test with.
        """
        self.user_details = {
            'email': 'test@example.com',
            'password': 'example123',
            'name': 'Test Name',
        }
        self.user = create_user(**self.user_details)
        self.client = APIClient()
        # Authenticate the client
        self.client.force_authenticate(user=self.user)

    def test_retrieve_profile_success(self):
        """_
        Test retrieving profile for logged in user.
        """
        res = self.client.get(ME_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {
            'email': self.user.email,
            'name': self.user.name,
        })

    def test_post_me_not_allowed(self):
        """_
        Test that POST is not allowed on the me URL.
        """
        res = self.client.post(ME_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_profile(self):
        """_
        Test updating the user profile for authenticated user.
        """
        payload = {
            'password': 'new_password',
            'name': 'New Name',
        }
        res = self.client.patch(ME_URL, payload)

        self.user.refresh_from_db()
        self.assertEqual(self.user.name, payload['name'])
        self.assertTrue(self.user.check_password(payload['password']))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
