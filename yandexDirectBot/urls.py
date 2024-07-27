from django.contrib import admin
from django.urls import path

from yandexDirectBot import settings
from yandexDirectBot.views import get_message

urlpatterns = [
    path('admin/', admin.site.urls),
    path(f'{settings.BOT_TOKEN}', get_message),
]
