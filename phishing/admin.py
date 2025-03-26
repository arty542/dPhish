from django.contrib import admin

# Register your models here.
from .models import EmailTracking

class EmailTrackingAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'test_date', 'clicked_link', 'passed_test')  # Show these columns
    search_fields = ('user_email',)  # Add a search bar for emails
    list_filter = ('clicked_link', 'passed_test')  # Add filter options

admin.site.register(EmailTracking, EmailTrackingAdmin)  # Register with customization
