from django.contrib import admin
from django.http import HttpResponse
from django.urls import path

from yandexDirectBot import settings
from yandexDirectBot.views import get_message

urlpatterns = [
    path('admin/', admin.site.urls),
    path('instruction/', lambda x: HttpResponse(
        """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        </head>
        <body>
        
        <div class="jumbotron text-center">
          <h2>Инструкция к админ панели</h2>
          <p>1. Перейти по <a href="https://oauth.yandex.ru/authorize?response_type=token&client_id=c95760dfb277445395cb14d33d33ca31">ссылке</a><p>
          <p>2. Получить токен</p>
          <p>3. Ввести его в админ панели</p>
        </div>
        
        </body>
        </html>
        """
    )),
    path(f'{settings.BOT_TOKEN}', get_message),
]
