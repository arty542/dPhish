from django.shortcuts import render
from django.http import JsonResponse
from .utils import send_phishing_email

def send_test_email(request):
    email = request.GET.get("email")  # Get email from request (e.g., URL parameter)
    if not email:
        return JsonResponse({"error": "Email parameter is missing"}, status=400)

    response = send_phishing_email(email)
    return JsonResponse({"message": response})

