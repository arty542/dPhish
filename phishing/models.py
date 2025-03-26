from django.db import models

class EmailTracking(models.Model):
    user_email = models.EmailField()
    test_date = models.DateTimeField(auto_now_add=True)
    clicked_link = models.BooleanField(default=False)
    passed_test = models.BooleanField(default=False)

    def __str__(self):
        return self.user_email