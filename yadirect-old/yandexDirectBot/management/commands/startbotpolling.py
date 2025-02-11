import time
from django.core.management.base import BaseCommand
from yandexDirectBot.src.telegram_api import bot


class Command(BaseCommand):
    def handle(self, *args, **options):
        try:
            bot.polling(none_stop=True, interval=5)
        except Exception as e:
            print(str(e))
            time.sleep(1)
            self.handle()
