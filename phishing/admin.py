from django.contrib import admin
from .models import PhishingEmail, EmailLog, EmailInteraction, Tutorial, Report, SimulationSession, SimulationReport, TargetEmail

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


@admin.register(SimulationSession)
class SimulationSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_by', 'start_time', 'end_time', 'is_active')
    list_filter = ('is_active', 'start_time')
    search_fields = ('created_by__username',)
    readonly_fields = ('start_time', 'end_time')


@admin.register(SimulationReport)
class SimulationReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'simulation', 'total_emails', 'opened_emails', 'clicked_emails', 'reported_emails')
    list_filter = ('simulation__start_time',)
    search_fields = ('simulation__created_by__username',)
    readonly_fields = ('report_data',)


@admin.register(TargetEmail)
class TargetEmailAdmin(admin.ModelAdmin):
    list_display = ('email', 'simulation', 'opened_at', 'clicked_at', 'reported_at')
    list_filter = ('simulation__is_active',)
    search_fields = ('email', 'simulation__created_by__username')
