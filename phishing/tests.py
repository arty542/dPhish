# tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import PhishingEmail, EmailLog

class SmokeTestCase(TestCase):

    def setUp(self):
        # Setup an admin user
        self.admin_user = User.objects.create_user(
            username='adminuser',
            password='adminpassword123',
            is_superuser=True,  # This makes the user an admin
            is_staff=True,       # This is typically required for admin access
            email='recipient@example.com' 
        )

        # Setup a phishing email (required for EmailLog)
        self.phishing_email = PhishingEmail.objects.create(
            subject="Phishing Test",
            body="This is a phishing email. Click here!"
        )

        # Create an EmailLog instance for the test
        self.email_log = EmailLog.objects.create(
            user=self.admin_user,
            email=self.phishing_email  # Correct the keyword argument here
        )

        self.client = APIClient()  # To simulate API requests

    def test_login_valid(self):
        url = reverse('login')  # URL name for login view
        data = {'username': 'adminuser', 'password': 'adminpassword123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)
        self.assertEqual(response.data['role'], 'admin')  # Check if the role is admin

    def test_login_invalid(self):
        url = reverse('login')
        data = {'username': 'adminuser', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_send_email(self):
        # Login first to get the token
        self.client.login(username='adminuser', password='adminpassword123')

        url = reverse('send_email_api')  # URL name for the send email view
        data = {'email': 'recipient@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tracking_link', response.data)

    def test_email_interaction(self):
        # Use the email_log.id from the setup step
        email_log_id = self.email_log.id
        url = reverse('track_click', args=[email_log_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)  # Redirect

    def tearDown(self):
        # Clean up any necessary objects
        self.admin_user.delete()
        self.phishing_email.delete()
        self.email_log.delete()
