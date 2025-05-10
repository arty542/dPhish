from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import PhishingEmail, EmailLog, EmailInteraction
from rest_framework.decorators import api_view, APIView, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework import status
import logging
from django.db import connection

logger = logging.getLogger(__name__)

ALLOWED_TABLES = {
    "auth_user": ["id", "username", "email", "is_active", "date_joined"],  # assuming Django's auth user
    "phishing_emailinteractions": ["id", "user_id", "email_id", "clicked", "timestamp"],
    "phishing_phishingemail": ["id", "subject", "sent_at", "is_simulated"],
    "phishing_tutorial": ["id", "title", "created_at"],
    "phishing_report": ["id", "user_id", "email_id", "reported_at"]
}

def home(request):
    result = {}

    for table, allowed_columns in ALLOWED_TABLES.items():
        try:
            with connection.cursor() as cursor:
                # Build safe SQL SELECT with only allowed columns
                columns_sql = ', '.join(f'"{col}"' for col in allowed_columns)
                cursor.execute(f'SELECT {columns_sql} FROM "{table}" LIMIT 10')
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()
                result[table] = [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            result[table] = f"Error: {str(e)}"

    return JsonResponse(result, safe=False)

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
    logger.info("Signup API hit")
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


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_phishing_email(request):
    subject = request.data.get('subject')
    body = request.data.get('body')
    email_type = request.data.get('email_type')

    if not all([subject, body, email_type]):
        return Response({'detail': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        email = PhishingEmail.objects.create(
            subject=subject,
            body=body,
            email_type=email_type
        )
        return Response({'message': 'Email created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)