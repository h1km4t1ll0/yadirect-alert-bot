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
        'alert_time',
        'chats',
    ]

    def chats(self, alert: Alert):
        return ', '.join(chat.name for chat in alert.chat.all())

    form = AlertForm


@admin.register(YandexDirectAccount)
class YandexDirectAccountAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'api_key',
        'min_sum',
        'notified',
        'monthly_budget',
        'monthly_summ',
    ]

    form = YandexDirectAccountForm


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'alerts_',
        'yandex_direct_accounts_',
        'goals_'
    ]

    def alerts_(self, project: Project):
        alerts = []
        for alert in project.alerts.all():
            for chat in alert.chat.all():
                alerts.append(f'{alert.alert_time} {chat.name}')

        return ', '.join(alerts)

    def yandex_direct_accounts_(self, project: Project):
        return ', '.join(yandex_direct_account.name for yandex_direct_account in project.yandex_direct_accounts.all())

    def goals_(self, project: Project):
        return list(map(lambda goal: goal['name'], project.goals))

    form = ProjectForm
    yandex_direct_accounts_.short_description = 'Аккаунты Яндекс.Директ'
    alerts_.short_description = 'Уведомления'
    goals_.short_description = 'Цели'
