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

    def get_account_report(
            self,
            token: str,
            date_from: str,
            goals: list[dict[str, str]] | None = None
    ) -> AccountStatistics:
        body_raw = {
            "method": "get",
            "params": {
                "SelectionCriteria": {
                    "DateFrom": date_from,
                    "DateTo": datetime.now().strftime('%Y-%m-%d')
                },
                "FieldNames": ["Clicks", "Impressions", "Cost", "Conversions"],
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

        if goals is not None:
            body_raw['params']['Goals'] = list(map(lambda goal: goal['goal'], goals))
            body_raw['params']['FieldNames'].append("CostPerConversion")

        body = json.dumps(body_raw, indent=4)
        req = requests.post(
            self.api_url + '/json/v5/reports',
            body,
            headers=headers
        )
        account_statistics = AccountStatistics.build(
            req.content.decode('utf-8'),
            goals
        )

        body_raw['params']['IncludeVAT'] = 'YES'
        body_raw['params']['FieldNames'] = ["Cost"]
        body = json.dumps(body_raw, indent=4)
        req = requests.post(
            self.api_url + '/json/v5/reports',
            body,
            headers=headers
        )
        account_statistics.set_cost_with_vat(req.content.decode('utf-8'))

        return account_statistics
