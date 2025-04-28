import json
from django.http import JsonResponse
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import PhishingEmail, EmailLog, EmailInteraction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

@api_view(['POST'])
def LoginView(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        # Check if user is an admin or a regular user
        role = 'admin' if user.is_superuser else 'user'
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'access_token': access_token,
            'role': role  # Send role in the response
        }, status=200)
    
    return Response({'detail': 'Invalid credentials!'}, status=401)

def send_email_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email", None)
            
            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)

            # Look up the user
            user = get_object_or_404(User, email=email)

            # Use any existing or new PhishingEmail (here we pick the first one)
            phishing_email = PhishingEmail.objects.first()
            if not phishing_email:
                return JsonResponse({"error": "No phishing emails found in DB"}, status=500)

            # Log the sent email
            email_log = EmailLog.objects.create(user=user, email=phishing_email)

            # Send the actual email with tracking link
            subject = phishing_email.subject
            tracking_link = f"http://127.0.0.1:8000/track-click/{email_log.id}/"
            message = f"{phishing_email.body}\n\nClick the link below:\n{tracking_link}"
            sender = "your-email@gmail.com"

            send_mail(subject, message, sender, [email])

            return JsonResponse({
                "message": "Email sent and tracking initialized!",
                "tracking_link": tracking_link
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


def track_click(request, log_id):
    email_log = get_object_or_404(EmailLog, id=log_id)

    # Save interaction
    EmailInteraction.objects.create(
        email_log=email_log,
        action_type='clicked'  # or 'opened', etc.
    )

    # Redirect to awareness page
    return redirect("https://your-awareness-page.com")  # Replace with actual URL
