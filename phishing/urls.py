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
    report_phishing,
    start_simulation,
    stop_simulation,
    add_target_emails,
    update_email_status,
    generate_report
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
    path('api/simulation/start/', start_simulation, name='start_simulation'),
    path('api/simulation/stop/', stop_simulation, name='stop_simulation'),
    path('api/simulation/add-emails/', add_target_emails, name='add_target_emails'),
    path('api/simulation/update-status/', update_email_status, name='update_email_status'),
    path('api/simulation/generate-report/', generate_report, name='generate_report'),
]
