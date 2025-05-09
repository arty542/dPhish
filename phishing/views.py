from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import PhishingEmail, EmailLog, EmailInteraction
from rest_framework.decorators import api_view, APIView, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def home(request):
    users = User.objects.values('id', 'username', 'email', 'is_superuser', 'is_staff')
    return JsonResponse({"users": list(users)})

@api_view(['POST'])
@permission_classes([AllowAny])
def LoginView(request):
    username = request.data.get('username')
    password = request.data.get('password')

    logger.info(f"Login attempt: username={username}")

    user = authenticate(username=username, password=password)
    logger.info(f"Authenticated user: {user}")

    if user is not None:
        role = 'admin' if user.is_superuser else 'user'
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        logger.info(f"Returning token for {username}, role={role}")
        return Response({
            'access_token': access_token,
            'role': role
        }, status=200)

    logger.info("Login failed: invalid credentials")
    return Response({'detail': 'Invalid credentials!'}, status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return Response({'detail': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'detail': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    refresh = RefreshToken.for_user(user)
    return Response({
        'access_token': str(refresh.access_token),
        'role': 'user'  # You can extend this if you have custom roles
    }, status=status.HTTP_201_CREATED)


@permission_classes([AllowAny])
class SendEmailApiView(APIView):
    permission_classes = [IsAuthenticated]  # Require authentication for this endpoint

    def post(self, request):
        try:
            email = request.data.get("email", None)
            
            if not email:
                return Response({"error": "Email is required"}, status=400)

            # Look up the user
            user = get_object_or_404(User, email=email)

            # Use any existing or new PhishingEmail (here we pick the first one)
            phishing_email = PhishingEmail.objects.first()
            if not phishing_email:
                return Response({"error": "No phishing emails found in DB"}, status=500)

            # Log the sent email
            email_log = EmailLog.objects.create(user=user, email=phishing_email)
            logger.info(f"Sent phishing email to {email}, Log ID: {email_log.id}")

            # Send the actual email with tracking link
            subject = phishing_email.subject
            tracking_link = f"http://127.0.0.1:8000/track-click/{email_log.id}/"
            message = f"{phishing_email.body}\n\nClick the link below:\n{tracking_link}"
            sender = "your-email@gmail.com"

            send_mail(subject, message, sender, [email])

            logger.info(f"Email sent with tracking link: {tracking_link}")

            return Response({
                "message": "Email sent and tracking initialized!",
                "tracking_link": tracking_link
            })

        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return Response({"error": str(e)}, status=500)

@csrf_exempt
def track_click(request, log_id):
    try:
        email_log = get_object_or_404(EmailLog, id=log_id)
        logger.info(f"Tracking click for Log ID: {log_id}")

        # Save interaction
        EmailInteraction.objects.create(
            email_log=email_log,
            action_type='clicked'  # or 'opened', etc.
        )

        logger.info(f"Interaction logged for Log ID: {log_id}")

        # Redirect to awareness page
        return redirect("https://your-awareness-page.com")  # Replace with actual URL

    except Exception as e:
        logger.error(f"Error in track_click for Log ID {log_id}: {str(e)}")
        return redirect("https://your-awareness-page.com")  # Default redirect on error

