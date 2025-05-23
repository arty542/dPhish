from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import PhishingEmail, EmailLog, EmailInteraction, SimulationSession, TargetEmail, SimulationReport
from rest_framework.decorators import api_view, APIView, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from rest_framework import status
import logging
from django.db import connection
import re
import base64
from django.conf import settings
from django.utils import timezone
from django.db.models import Count
import json

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
    permission_classes = [IsAuthenticated]

    def validate_email(self, email):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    def post(self, request):
        try:
            email = request.data.get("email", None)
            
            if not email:
                return Response({"error": "Email is required"}, status=400)

            if not self.validate_email(email):
                return Response({"error": "Invalid email format"}, status=400)

            # Get the latest phishing email template
            phishing_email = PhishingEmail.objects.last()
            if not phishing_email:
                return Response({"error": "No phishing email template found"}, status=500)

            try:
                # Look up or create the user
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={'username': email.split('@')[0]}
                )

                # Log the sent email
                email_log = EmailLog.objects.create(user=user, email=phishing_email)
                logger.info(f"Created email log for {email}, Log ID: {email_log.id}")

                # Create tracking URLs
                base_url = request.build_absolute_uri('/').rstrip('/')
                tracking_pixel = f"{base_url}/track-open/{email_log.id}/"
                phishing_link = f"{base_url}/fake-login/{email_log.id}/"
                report_link = f"{base_url}/report-phishing/{email_log.id}/"

                # Create HTML message with multiple tracking pixels and styled links
                html_message = f"""
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    </head>
                    <body>
                        <!-- Multiple tracking pixels for better tracking -->
                        <img src="{tracking_pixel}" alt="" width="1" height="1" style="display:none !important;" />
                        <img src="{tracking_pixel}" alt="" width="1" height="1" style="display:none !important;" />
                        
                        <!-- Email content -->
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            {phishing_email.body}
                            <br/><br/>
                            <a href="{phishing_link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Click here to verify</a>
                            <br/><br/>
                            <p style="font-size: 12px; color: #666;">
                                Think this is a phishing email? 
                                <a href="{report_link}" style="color: #dc3545;">Report it</a>
                            </p>
                        </div>
                        
                        <!-- More tracking pixels -->
                        <img src="{tracking_pixel}" alt="" width="1" height="1" style="display:none !important;" />
                        <img src="{tracking_pixel}" alt="" width="1" height="1" style="display:none !important;" />
                    </body>
                </html>
                """

                # Send the email with both HTML and plain text versions
                send_mail(
                    subject=phishing_email.subject,
                    message=phishing_email.body,  # Plain text version
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False,
                    html_message=html_message
                )

                logger.info(f"Email sent successfully to {email}")
                return Response({
                    "message": "Email sent successfully",
                    "tracking_pixel": tracking_pixel,
                    "phishing_link": phishing_link,
                    "report_link": report_link
                })

            except Exception as e:
                logger.error(f"Error sending email to {email}: {str(e)}")
                return Response({
                    "error": f"Failed to send email: {str(e)}"
                }, status=500)

        except Exception as e:
            logger.error(f"Error in SendEmailApiView: {str(e)}")
            return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def track_open(request, log_id):
    """Track when an email is opened via the tracking pixel"""
    try:
        email_log = get_object_or_404(EmailLog, id=log_id)
        
        # Always create a new interaction for opens
        EmailInteraction.objects.create(
            email_log=email_log,
            action_type='opened',
            action_time=timezone.now()
        )
        logger.info(f"Email opened: Log ID {log_id}")
        
        # Return a 1x1 transparent GIF with cache control headers
        gif_data = base64.b64decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        response = HttpResponse(gif_data, content_type='image/gif')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
    except Exception as e:
        logger.error(f"Error tracking email open: {str(e)}")
        return HttpResponse(status=204)

@api_view(['GET'])
@permission_classes([AllowAny])
def fake_login(request, log_id):
    """Handle clicks on the phishing link"""
    try:
        email_log = get_object_or_404(EmailLog, id=log_id)
        EmailInteraction.objects.create(
            email_log=email_log,
            action_type='clicked'
        )
        logger.info(f"Phishing link clicked: Log ID {log_id}")
        
        # Get frontend URL from settings with fallback
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        login_url = f"{frontend_url}/signup"
        
        return redirect(login_url)
    except Exception as e:
        logger.error(f"Error tracking link click: {str(e)}")
        # Use the same URL construction in the error case
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        return redirect(f"{frontend_url}/signup")

@api_view(['GET'])
@permission_classes([AllowAny])
def report_phishing(request, log_id):
    """Handle phishing report submissions"""
    try:
        email_log = get_object_or_404(EmailLog, id=log_id)
        EmailInteraction.objects.create(
            email_log=email_log,
            action_type='reported'
        )
        logger.info(f"Email reported as phishing: Log ID {log_id}")
        
        # Redirect to a thank you page or show a message
        return redirect('http://localhost:3000/thank-you-report')  # Update with your frontend URL
    except Exception as e:
        logger.error(f"Error reporting phishing: {str(e)}")
        return redirect('http://localhost:3000/thank-you-report')

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_simulation(request):
    # End any existing active simulations
    SimulationSession.objects.filter(is_active=True).update(
        is_active=False,
        end_time=timezone.now()
    )
    
    # Create new simulation session
    simulation = SimulationSession.objects.create(
        created_by=request.user
    )
    
    return Response({
        'simulation_id': simulation.id,
        'start_time': simulation.start_time
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def stop_simulation(request):
    simulation_id = request.data.get('simulation_id')
    try:
        simulation = SimulationSession.objects.get(id=simulation_id, is_active=True)
        simulation.is_active = False
        simulation.end_time = timezone.now()
        simulation.save()
        
        return Response({'status': 'success'})
    except SimulationSession.DoesNotExist:
        return Response({'error': 'No active simulation found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_target_emails(request):
    simulation_id = request.data.get('simulation_id')
    emails = request.data.get('emails', [])
    
    try:
        simulation = SimulationSession.objects.get(id=simulation_id, is_active=True)
        
        # Create TargetEmail objects for each email
        target_emails = []
        for email in emails:
            # Create or get user for the email
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'username': email.split('@')[0]}
            )
            
            # Create target email
            target_email = TargetEmail.objects.create(
                email=email,
                simulation=simulation,
                user=user
            )
            target_emails.append(target_email)
            
            # Create initial email log and interaction
            email_log = EmailLog.objects.create(
                user=user,
                email=PhishingEmail.objects.last()  # Get the latest phishing email template
            )
            
            EmailInteraction.objects.create(
                email_log=email_log,
                action_type='created',
                action_time=timezone.now()
            )
        
        return Response({
            'status': 'success',
            'emails_added': len(emails),
            'target_emails': [{'email': te.email, 'id': te.id} for te in target_emails]
        })
    except SimulationSession.DoesNotExist:
        return Response({'error': 'No active simulation found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_email_status(request):
    email = request.data.get('email')
    status_type = request.data.get('status')  # 'opened', 'clicked', or 'reported'
    
    try:
        target_email = TargetEmail.objects.get(email=email)
        if not target_email.simulation.is_active:
            return Response({'error': 'Simulation is not active'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Update TargetEmail status
        if status_type == 'opened':
            target_email.opened_at = timezone.now()
        elif status_type == 'clicked':
            target_email.clicked_at = timezone.now()
        elif status_type == 'reported':
            target_email.reported_at = timezone.now()
        target_email.save()
        
        # Create EmailInteraction record
        email_log = EmailLog.objects.filter(user=target_email.user).latest('sent_at')
        EmailInteraction.objects.create(
            email_log=email_log,
            action_type=status_type,
            action_time=timezone.now()
        )
        
        return Response({'status': 'success'})
    except TargetEmail.DoesNotExist:
        return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_report(request):
    simulation_id = request.query_params.get('simulation_id')
    
    try:
        simulation = SimulationSession.objects.get(id=simulation_id)
        
        # Get all email logs for this simulation period
        email_logs = EmailLog.objects.filter(
            sent_at__gte=simulation.start_time,
            sent_at__lte=simulation.end_time if simulation.end_time else timezone.now()
        )
        
        # Get all interactions for these email logs
        interactions = EmailInteraction.objects.filter(email_log__in=email_logs)
        
        # Calculate statistics
        total_emails = email_logs.count()
        opened_emails = interactions.filter(action_type='opened').count()
        clicked_emails = interactions.filter(action_type='clicked').count()
        reported_emails = interactions.filter(action_type='reported').count()
        
        # Calculate time-based metrics
        first_interaction = interactions.order_by('action_time').first()
        last_interaction = interactions.order_by('-action_time').first()
        
        # Format datetime objects for JSON serialization
        start_time = simulation.start_time.isoformat() if simulation.start_time else None
        end_time = simulation.end_time.isoformat() if simulation.end_time else None
        duration = (simulation.end_time - simulation.start_time).total_seconds() if simulation.end_time else None
        first_interaction_time = first_interaction.action_time.isoformat() if first_interaction else None
        last_interaction_time = last_interaction.action_time.isoformat() if last_interaction else None
        
        # Format interaction timeline
        interaction_timeline = [
            {
                'action_type': interaction.action_type,
                'action_time': interaction.action_time.isoformat()
            }
            for interaction in interactions.order_by('action_time')
        ]
        
        # Format email types
        email_types = list(email_logs.values('email__email_type').annotate(count=Count('id')))
        
        report_data = {
            'start_time': start_time,
            'end_time': end_time,
            'duration': duration,
            'success_rate': (clicked_emails / total_emails * 100) if total_emails > 0 else 0,
            'report_rate': (reported_emails / total_emails * 100) if total_emails > 0 else 0,
            'first_interaction': first_interaction_time,
            'last_interaction': last_interaction_time,
            'interaction_timeline': interaction_timeline,
            'email_types': email_types
        }
        
        # Create report
        report = SimulationReport.objects.create(
            simulation=simulation,
            total_emails=total_emails,
            opened_emails=opened_emails,
            clicked_emails=clicked_emails,
            reported_emails=reported_emails,
            report_data=report_data
        )
        
        return Response({
            'report_id': report.id,
            'total_emails': total_emails,
            'opened_emails': opened_emails,
            'clicked_emails': clicked_emails,
            'reported_emails': reported_emails,
            'report_data': report_data
        })
    except SimulationSession.DoesNotExist:
        return Response({'error': 'Simulation not found'}, status=status.HTTP_404_NOT_FOUND)