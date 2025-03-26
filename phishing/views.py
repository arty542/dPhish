# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.core.mail import send_mail
# import json

# @csrf_exempt  # Disable CSRF protection for testing (NOT recommended in production)
# def send_email_api(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)  # Get email from frontend
#             email = data.get("email", None)
#             if not email:
#                 return JsonResponse({"error": "Email is required"}, status=400)

#             # Send email
#             subject = "Phishing Test Email"
#             message = "Click the link below:\nhttps://www.youtube.com"
#             sender = "your-email@gmail.com"

#             send_mail(subject, message, sender, [email])

#             return JsonResponse({"message": "Email sent successfully!"})
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request"}, status=400)
import json
from django.http import JsonResponse
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from .models import EmailTracking  # Import your model

@csrf_exempt  # Allow API calls from frontend (only for development)
def send_email_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Get email from frontend
            email = data.get("email", None)
            
            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)

            # Store email tracking entry in database
            tracking_entry = EmailTracking.objects.create(user_email=email)

            # Send email with new tracking link
            subject = "Phishing Test Email"
            tracking_link = f"http://127.0.0.1:8000/track-click/{tracking_entry.id}/"  # Updated link
            message = f"Click the link below:\n{tracking_link}"
            sender = "your-email@gmail.com"

            send_mail(subject, message, sender, [email])

            return JsonResponse({"message": "Email sent and tracked successfully!", "tracking_link": tracking_link})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

def track_click(request, tracking_id):
    tracking_entry = get_object_or_404(EmailTracking, id=tracking_id)
    
    # Mark as clicked
    tracking_entry.clicked_link = True
    tracking_entry.save()

    # Redirect the user somewhere (e.g., a phishing page or an awareness page)
    return redirect("https://your-awareness-page.com")  # Change this to your real phishing page