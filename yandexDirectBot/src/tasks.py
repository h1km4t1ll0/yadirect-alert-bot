import logging

from celery.app import shared_task

from yandexDirectBot import settings
from yandexDirectBot.models import OrderDao, BlacklistDAO
from yandexDirectBot.src.api import API

logger = logging.getLogger(__name__)


@shared_task
def work_orders():
    try:
        bot = API()
        logger.info("Прошлись по всем предметам! Замираем на минуту")
        user_orders = bot.get_user_orders()

        for user_order in user_orders:
            orders = OrderDao.objects.filter(bpid=user_order['id'])

            if len(orders) == 0:
                order = OrderDao(
                    bpid=user_order['id'],
                    name=user_order['item']['name'],
                    max_key=0,
                    max_ref=0,
                    step_key=0,
                    step_ref=0,
                    is_active=False,
                )
                order.save()
                continue
            else:
                user_order['max_key'] = orders[0].max_key
                user_order['max_ref'] = orders[0].max_ref
                user_order['step_key'] = orders[0].step_key
                user_order['step_ref'] = orders[0].step_ref
                user_order['max_key'] = orders[0].max_key
                user_order['is_active'] = orders[0].is_active

            if not user_order['is_active']:
                continue

            all_orders = bot.get_stat_order(user_order)
            type_currency = list(user_order["currencies"].keys())[0]
            logger.info(f"В обработке предмет: {user_order['item']['name']} c ценой:"
                        f" {user_order['currencies'][type_currency]} {type_currency}")
            if len(all_orders) < 2:
                continue

            max_price = 0
            for order in all_orders:
                if order['steamid'] == settings.MY_STEAM_ID:
                    continue
                if not user_order['is_active']:
                    banned_id_list = BlacklistDAO.objects.filter(steamid=order['steamid'])
                    if len(banned_id_list) > 0:
                        continue

                if order['currencies'][type_currency] > max_price:
                    max_price = order['currencies'][type_currency]

            user_order["currencies"]['keys'] = max_price + user_order['step_key']
            user_order["currencies"]['ref'] = max_price + user_order['step_ref']

            logger.info(
                f"Его максимальная цена {max_price}. Наша новая цена: {user_order['currencies'][type_currency]}")
            bot.update_order(order=user_order)

        logger.info("Прошлись по всем предметам! Замираем на минуту")
    except Exception as e:
        logger.error(f'An error occurred! {str(e)}')
