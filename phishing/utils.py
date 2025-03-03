# from django.core.mail import send_mail

# def send_phishing_email(email):
#     subject = "Phishing Test"
#     message = "This is a phishing awareness test email."
#     sender = "your-email@gmail.com"
#     recipient_list = [email]

#     send_mail(subject, message, sender, recipient_list)

from django.core.mail import send_mail

def send_phishing_email():
    subject = "Security Alert: Verify Your Account Now!"
    message = "Dear user, your account may be compromised. Click here to verify: http://fake-link.com"
    sender = "your-email@gmail.com"

    recipient_list = [
        "user1@example.com",
        "user2@example.com",
        "user3@example.com"
    ]  # Add multiple emails here

    send_mail(subject, message, sender, recipient_list)

    return "Emails sent successfully!"
