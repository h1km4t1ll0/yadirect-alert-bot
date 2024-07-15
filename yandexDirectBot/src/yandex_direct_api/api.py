import json
import logging
import time
from datetime import datetime

import requests

from yandexDirectBot import settings
from yandexDirectBot.src.yandex_direct_api.account_balance import AccountBalance
from yandexDirectBot.src.yandex_direct_api.account_statistics import AccountStatistics


class YandexDirectAPI:
    def __init__(self):
        self.api_url = settings.YANDEX_DIRECT_BASE_URL

    def get_account_balance(self, token: str) -> AccountBalance:
        body = {
            "param": {
                "Action": "Get",
            },
            "method": "AccountManagement",
            'token': token
        }
        headers = {
                   "Authorization": "Bearer " + token,
                   "Accept-Language": "ru",
                   "processingMode": "auto"
        }

        body = json.dumps(body, indent=4)
        req = requests.post(
            self.api_url + '/live/v4/json',
            body,
            headers=headers
        )
        logging.info(req.json()['data']['Accounts'][0])
        logging.info(req.json()['data']['Accounts'])
        return AccountBalance.build(req.json()['data']['Accounts'][0])

    def get_account_report(self, token: str, date_from: str) -> AccountStatistics:
        body = {
            "method": "get",
            "params": {
                "SelectionCriteria": {
                    "DateFrom": date_from,
                    "DateTo": datetime.now().strftime('%Y-%m-%d')
                },
                "FieldNames": ["Clicks", "Impressions", "Conversions", "Cost"],
                "ReportType": "CUSTOM_REPORT",
                "DateRangeType": "CUSTOM_DATE",
                "IncludeVAT": 'NO',
                "ReportName": f'report-{int(time.time())}',
                "Format": "TSV",
                "IncludeDiscount": "NO"
            }
        }
        headers = {
            "Authorization": "Bearer " + token,
            "Accept-Language": "ru",
            "processingMode": "auto"
        }

        body = json.dumps(body, indent=4)
        req = requests.post(
            self.api_url + '/json/v5/reports',
            body,
            headers=headers
        )

        return AccountStatistics.build(req.content.decode('utf-8'))
