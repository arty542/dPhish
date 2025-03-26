# from django.core.mail import send_mail

# def send_phishing_email(email):
#     subject = "Phishing Test"
#     message = "This is a phishing awareness test email."
#     sender = "your-email@gmail.com"
#     recipient_list = [email]

#     send_mail(subject, message, sender, recipient_list)

from django.core.mail import send_mail

# def send_phishing_email():
#     subject = "Security Alert: Verify Your Account Now!"
#     message = "Dear user, your account may be compromised. Click here to verify: http://fake-link.com"
#     sender = "your-email@gmail.com"

#     recipient_list = [
#         "bscs23204@itu.edu.pk",
#         "bscs23162@itu.edu.pk",
#         "abidsaleha05@gmail.com"
#     ]  # Add multiple emails here

#     send_mail(subject, message, sender, recipient_list)

#     return "Emails sent successfully!"

def send_phishing_email():
    subject = "Security Alert: Verify Your Account Now!"
    tracking_id = "unique-user-id"  # You can replace this dynamically
    message = f"""
    <html>
        <body>
            <p>Dear user, your account may be compromised. Click here to verify: 
                <a href="http://127.0.0.1:8000/track_click/{tracking_id}">Verify Now</a>
            </p>
            <img src="http://127.0.0.1:8000/track_open/{tracking_id}" width="1" height="1" style="display:none;">
        </body>
    </html>
    """
    sender = "your-email@gmail.com"
    recipient_list = [
        "bscs23204@itu.edu.pk",
        "abidsaleha05@gmail.com"
    ]

    send_mail(subject, "", sender, recipient_list, html_message=message)
    return "Emails sent successfully!"