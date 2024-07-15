from django import forms

from .models import Chat, Alert, YandexDirectAccount, Project
from .widgets import TimePickerInput


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

        widgets = {
            'alert_time': TimePickerInput(),
        }


class YandexDirectAccountForm(forms.ModelForm):
    class Meta:
        model = YandexDirectAccount
        fields = (
            'name',
            'api_key',
            'min_sum',
            'notified'
        )


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = (
            'name',
            'yandex_direct_accounts',
            'alerts'
        )
