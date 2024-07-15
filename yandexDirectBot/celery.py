# celery.py
import os

from celery import Celery
from yandexDirectBot import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yandexDirectBot.settings')

# app = Celery('yandexDirectBot')
app = Celery(__name__)
# app.config_from_object('yandexDirectBot.settings')
app.config_from_object('django.conf:settings', namespace='CELERY')
# app.config_from_object(__name__)
# app.conf.broker_url = 'memory://'
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
