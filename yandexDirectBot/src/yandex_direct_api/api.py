import json
import logging
import time
import uuid
from datetime import datetime

import requests

from yandexDirectBot.src.yandex_direct_api.account_balance import AccountBalance
from yandexDirectBot.src.yandex_direct_api.account_statistics import AccountStatistics


class YandexDirectAPI:
    def __init__(self):
        self.api_url = 'https://api.direct.yandex.ru'

    @staticmethod
    def safely_execute_request(
        api_url: str,
        body: str,
        headers: any = None,
    ):
        while True:
            try:
                req = requests.post(
                    api_url,
                    body,
                    headers=headers
                )
                req.encoding = 'utf-8'  # Принудительная обработка ответа в кодировке UTF-8
                print('get_account_balance', req.status_code)
                if req.status_code == 400:
                    print("Параметры запроса указаны неверно или достигнут лимит отчетов в очереди")
                    print("RequestId: {}".format(req.headers.get("RequestId", False)))
                    print("JSON-код ответа сервера: \n{}".format(req.json()))
                    break
                elif req.status_code == 200:
                    print("Отчет создан успешно")
                    print("RequestId: {}".format(req.headers.get("RequestId", False)))
                    break
                elif req.status_code == 201:
                    print("Отчет успешно поставлен в очередь в режиме офлайн")
                    retryIn = int(req.headers.get("retryIn", 60))
                    print("Повторная отправка запроса через {} секунд".format(retryIn))
                    print("RequestId: {}".format(req.headers.get("RequestId", False)))
                    time.sleep(retryIn)
                elif req.status_code == 202:
                    print("Отчет формируется в режиме офлайн")
                    retryIn = int(req.headers.get("retryIn", 60))
                    print("Повторная отправка запроса через {} секунд".format(retryIn))
                    print("RequestId:  {}".format(req.headers.get("RequestId", False)))
                    time.sleep(retryIn)
                elif req.status_code == 500:
                    print("При формировании отчета произошла ошибка. Пожалуйста, попробуйте повторить запрос позднее")
                    print("RequestId: {}".format(req.headers.get("RequestId", False)))
                    print("JSON-код ответа сервера: \n{}".format(req.json()))
                    break
                elif req.status_code == 502:
                    print("Время формирования отчета превысило серверное ограничение.")
                    print(
                        "Пожалуйста, попробуйте изменить параметры запроса - уменьшить период и "
                        "количество запрашиваемых данных."
                    )
                    print("JSON-код запроса: {}".format(body))
                    print("RequestId: {}".format(req.headers.get("RequestId", False)))
                    print("JSON-код ответа сервера: \n{}".format(req.json()))
                    break
                else:
                    print("Произошла непредвиденная ошибка")
                    print("RequestId:  {}".format(req.headers.get("RequestId", False)))
                    print("JSON-код запроса: {}".format(body))
                    print("JSON-код ответа сервера: \n{}".format(req.json()))
                    break
            except Exception as e:
                logging.error(e)
        return req

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
                "ReportName": f'report-{str(uuid.uuid4())}',
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
        req = YandexDirectAPI.safely_execute_request(
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
        body_raw['params']['ReportName'] = f'report-{str(uuid.uuid4())}'

        body = json.dumps(body_raw, indent=4)
        req = YandexDirectAPI.safely_execute_request(
            self.api_url + '/json/v5/reports',
            body,
            headers=headers
        )

        account_statistics.set_cost_with_vat(req.content.decode('utf-8'))
        return account_statistics
