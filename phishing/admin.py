from django.contrib import admin

# Register your models here.
from .models import TargetUser, PhishingEmail, ClickTracking

admin.site.register(TargetUser)
admin.site.register(PhishingEmail)
admin.site.register(ClickTracking)
