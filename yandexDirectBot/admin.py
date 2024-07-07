from django.contrib import admin
from django.forms import TimeInput
from django.utils.safestring import mark_safe

from .forms import ChatForm, AlertForm, YandexDirectAccountForm, ProjectForm
from .models import Chat, Alert, YandexDirectAccount, Project


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = [
        'chat_id',
        'name'
    ]

    form = ChatForm




@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = [
        'chat',
        'alert_time'
    ]

    def chat(self, alert: Alert):
        return ', '.join(chat.name for chat in alert.chat.all())

    form = AlertForm


@admin.register(YandexDirectAccount)
class YandexDirectAccountAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'api_key',
    ]фввЖ

    form = YandexDirectAccountForm


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'alerts',
        'yandex_direct_accounts',
        'name',
        'week_budget'
    ]

    def alerts(self, project: Project):
        return ', '.join(alert.name for alert in project.alerts.all())

    def yandex_direct_accounts(self, project: Project):
        return ', '.join(yandex_direct_account.name for yandex_direct_account in project.yandex_direct_accounts.all())

    form = ProjectForm
