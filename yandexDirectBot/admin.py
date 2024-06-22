from django.contrib import admin

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

    form = AlertForm


@admin.register(YandexDirectAccount)
class YandexDirectAccountAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'api_key',
    ]

    form = YandexDirectAccountForm


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'alerts',
        'yandex_direct_accounts',
        'name',
        'week_budget'
    ]

    form = ProjectForm
