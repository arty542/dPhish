from django.urls import path
from .views import (
    track_click, 
    SendEmailApiView, 
    LoginView, 
    home, 
    register_user, 
    create_phishing_email,
    track_open,
    fake_login,
    report_phishing
)

urlpatterns = [
    path('', home, name='home'),
    path('api/send-email/', SendEmailApiView.as_view(), name='send_email_api'),
    path('track-open/<int:log_id>/', track_open, name='track_open'),
    path('fake-login/<int:log_id>/', fake_login, name='fake_login'),
    path('report-phishing/<int:log_id>/', report_phishing, name='report_phishing'),
    path('api/login/', LoginView, name='login'),
    path('api/register/', register_user, name='register'),
    path('api/create-email/', create_phishing_email, name='create-phishing-email'),
]
