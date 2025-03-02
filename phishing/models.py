from django.db import models

# Create your models here.

class TargetUser(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

class PhishingEmail(models.Model):
    subject = models.CharField(max_length=255)
    body = models.TextField()
    sent_to = models.ForeignKey(TargetUser, on_delete=models.CASCADE)

class ClickTracking(models.Model):
    user = models.ForeignKey(TargetUser, on_delete=models.CASCADE)
    email = models.ForeignKey(PhishingEmail, on_delete=models.CASCADE)
    clicked = models.BooleanField(default=False)
