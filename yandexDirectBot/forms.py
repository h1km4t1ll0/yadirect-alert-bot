from django import forms

from .models import Chat, Alert, YandexDirectAccount, Project


class ChatForm(forms.ModelForm):
    class Meta:
        model = Chat
        fields = (
            'chat_id',
            'name'
        )


class AlertForm(forms.ModelForm):
    class Meta:
        model = Alert
        fields = (
            'chat',
            'alert_time'
        )


class YandexDirectAccountForm(forms.ModelForm):
    class Meta:
        model = YandexDirectAccount
        fields = (
            'name',
            'api_key',
        )


class ProjectForm(forms.ModelForm):
    class Meta:
        model = YandexDirectAccount
        fields = (
            'alerts',
            'yandex_direct_accounts',
            'name',
            'week_budget'
        )
