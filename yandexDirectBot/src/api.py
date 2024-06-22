import requests

from yandexDirectBot import settings


class API:
    def __init__(self):
        self.api_key = settings.API_KEY
        self.user_token = settings.USER_TOKEN
        self.api_url = settings.API_URL
        self.my_steam_id = settings.MY_STEAM_ID

    def update_order(self, order: dict) -> bool:
        params = {
            "currencies": order['currencies']
        }

        headers = {'Content-type': 'application/json'}
        try:
            create_res = requests.patch(f"{self.api_url}/v2/classifieds/listings/{order['id']}?token={self.user_token}",
                                        headers=headers, json=params)
            create_res = create_res.json()
        except Exception as ex:
            return False

        return True

    def get_stat_order(self, order: dict) -> list:
        orders = requests.get(
            url=f"{self.api_url}/classifieds/listings/snapshot?token={self.user_token}&sku={order['item']['name']}&appid=440")
        orders = orders.json()
        print("-----STAT ORDER-----")
        print(orders)
        result = []
        for elem in orders['listings']:
            if elem['intent'] == 'buy' and list(order['currencies'].keys())[0] in list(elem['currencies'].keys()):
                item_result = {
                    'steamid': elem['steamid'],
                    'attributes': elem['item'].get('attributes', None),
                    'currencies': elem['currencies']
                }
                result.append(item_result)

        return result

    def get_user_orders(self) -> list:
        res = requests.get(f"{self.api_url}/v2/classifieds/listings?token={self.user_token}")
        res = res.json()
        print("-----USER ORDERS-----")
        print(res)

        if res.get("results", None) is None:
            return []

        if len(res['results']) == 0:
            return []

        result = []
        for elem in res['results']:
            if elem['intent'] == 'buy':
                result.append(elem)

        return result
