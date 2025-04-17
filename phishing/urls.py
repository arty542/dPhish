from django.urls import path
# from .views import send_test_email
# from .views import track_open, track_click
# from .views import fake_login_page
from .views import send_email_api, track_click

urlpatterns = [
    #path("send_test_email/", send_test_email, name="send_test_email"),
    # path("track_open/<str:tracking_id>/", track_open, name="track_open"),
    # path("track_click/<str:tracking_id>/", track_click, name="track_click"),
    # path("fake_login/", fake_login_page, name="fake_login"),
    path("api/send-email/", send_email_api, name="send_email_api"),
    path('track-click/<int:log_id>/', track_click, name='track_click'),
]
