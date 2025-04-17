from django.contrib import admin
from .models import PhishingEmail, EmailLog, EmailInteraction, Tutorial, Report

@admin.register(PhishingEmail)
class PhishingEmailAdmin(admin.ModelAdmin):
    list_display = ('subject', 'email_type', 'created_at')
    search_fields = ('subject', 'email_type')


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'sent_at')
    search_fields = ('user__username', 'email__subject')
    list_filter = ('sent_at',)


@admin.register(EmailInteraction)
class EmailInteractionAdmin(admin.ModelAdmin):
    list_display = ('get_user_email', 'get_email_subject', 'action_type', 'action_time')
    search_fields = ('email_log__user__username',)
    list_filter = ('action_type',)

    def get_user_email(self, obj):
        return obj.email_log.user.email
    get_user_email.short_description = 'User Email'

    def get_email_subject(self, obj):
        return obj.email_log.email.subject
    get_email_subject.short_description = 'Email Subject'


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    list_display = ('title', 'email_type')
    search_fields = ('title', 'email_type')


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'phishing_email', 'score', 'report_date')
    list_filter = ('score',)
    search_fields = ('user__username', 'phishing_email__subject')
