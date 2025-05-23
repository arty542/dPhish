from django.db import models
from django.contrib.auth.models import User

class PhishingEmail(models.Model):
    subject = models.CharField(max_length=200)
    body = models.TextField()
    email_type = models.CharField(max_length=100)  # e.g. "Fake invoice", "Password reset"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} ({self.email_type})"


class EmailLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.ForeignKey(PhishingEmail, on_delete=models.CASCADE)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sent to {self.user.username} on {self.sent_at}"


class EmailInteraction(models.Model):
    ACTION_CHOICES = [
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('reported', 'Reported'),
        ('ignored', 'Ignored'),
    ]

    email_log = models.ForeignKey(EmailLog, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=20, choices=ACTION_CHOICES)
    action_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email_log.user.username} {self.action_type} at {self.action_time}"


class Tutorial(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()  # This could also be a URL or markdown
    email_type = models.CharField(max_length=100)  # Match with types in PhishingEmail

    def __str__(self):
        return self.title


class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phishing_email = models.ForeignKey(PhishingEmail, on_delete=models.CASCADE)
    score = models.IntegerField()  # 1 = passed, 0 = failed
    report_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Score: {self.score}"


class SimulationSession(models.Model):
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Simulation {self.id} - {'Active' if self.is_active else 'Inactive'}"


class TargetEmail(models.Model):
    email = models.EmailField(unique=True)
    simulation = models.ForeignKey(SimulationSession, on_delete=models.CASCADE)
    sent_at = models.DateTimeField(auto_now_add=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    reported_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.email


class SimulationReport(models.Model):
    simulation = models.ForeignKey(SimulationSession, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    total_emails = models.IntegerField(default=0)
    opened_emails = models.IntegerField(default=0)
    clicked_emails = models.IntegerField(default=0)
    reported_emails = models.IntegerField(default=0)
    report_data = models.JSONField(default=dict)

    def __str__(self):
        return f"Report for Simulation {self.simulation.id}"
