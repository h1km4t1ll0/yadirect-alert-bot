import requests

from yandexDirectBot import settings


class YandexDirectAPI:
    def __init__(self):
        self.user_token = settings.USER_TOKEN
        self.api_url = settings.API_URL
        self.my_steam_id = settings.MY_STEAM_ID
