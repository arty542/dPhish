from django.urls import path
from .views import track_click, SendEmailApiView, LoginView, home, register_user

urlpatterns = [
    path('', home, name='home'),
    path("api/send-email/", SendEmailApiView.as_view(), name="send_email_api"),  # Using CBV
    path('track-click/<int:log_id>/', track_click, name='track_click'),  # Using FBV
    path('api/login/', LoginView, name='login'),
    path('api/register/', register_user),
]
