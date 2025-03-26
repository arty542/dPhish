from django.http import JsonResponse
from .utils import send_phishing_email
from django.http import HttpResponse
from django.shortcuts import redirect
from .models import EmailTracking
from django.shortcuts import render

def send_test_email(request):
    response = send_phishing_email()  
    return JsonResponse({"message": response})

def track_open(request, tracking_id):
    EmailTracking.objects.filter(id=tracking_id).update(opened=True)
    # Return a 1x1 transparent pixel
    pixel = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00\xFF\xFF\xFF\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x4C\x01\x00\x3B'
    return HttpResponse(pixel, content_type="image/gif")

def track_click(request, tracking_id):
    """ Track when a phishing link is clicked """
    EmailTracking.objects.filter(id=tracking_id).update(clicked=True)
    return redirect("https://www.youtube.com/")  # Change this to your actual page

def fake_login_page(request):
    return render(request, "fake_login.html")