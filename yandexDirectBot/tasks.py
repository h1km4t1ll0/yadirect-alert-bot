import datetime
import logging

from celery.app import shared_task

from yandexDirectBot.models import Project
from yandexDirectBot.src.telegram_alert import send_message_to_chat
from yandexDirectBot.src.yandex_direct_api.api import YandexDirectAPI

logger = logging.getLogger(__name__)


@shared_task
def every_day_alert():
    projects = Project.objects.all()
    current_time = datetime.datetime.now().strftime('%H:%M:00')
    current_date = datetime.datetime.now().strftime('%Y-%m-%d')
    logger.info("Started every_day_alert job")
    yandex_direct_api = YandexDirectAPI()

    for project in projects:
        for alert in project.alerts.all():
            logger.info(alert.alert_time)
            logger.info(f'{alert.alert_time == current_time} {alert.alert_time} {current_time}')
            if str(alert.alert_time) == current_time:
                for account in project.yandex_direct_accounts.all():
                    account_report = yandex_direct_api.get_account_report(
                        account.api_key,
                        current_date
                    )
                    account_balance = yandex_direct_api.get_account_balance(
                        account.api_key
                    )

                    for chat in alert.chat.all():
                        if account_report.error_message:
                            logger.error(account_report.error_message)

                        message = (
                            f'Ежедневный отчет по аккаунту <i>{account_balance.login}</i>\n\n'
                            f'Показы: <b>{account_report.impressions}</b>\n'
                            f'Клики: <b>{account_report.clicks}</b>\n'
                            f'Конверсии: <b>{account_report.conversions}</b>\n'
                            'Расход: <b>' + '{:,.0f}'.format(account_report.cost) + '₽</b>\n'
                            'Баланс: <b>' + '{:,.0f}'.format(account_balance.amount) + '₽</b>\n'
                        )

                        logger.info(f'Notified {chat.chat_id}')
                        send_message_to_chat(chat.chat_id, message)


@shared_task
def balance_change_alert():
    projects = Project.objects.all()
    yandex_direct_api = YandexDirectAPI()
    logger.info("Started balance_change_alert job")

    for project in projects:
        for alert in project.alerts.all():
            for account in project.yandex_direct_accounts.all():
                account_balance = yandex_direct_api.get_account_balance(
                    account.api_key
                )

                if account_balance.amount < account.min_sum and not account.notified:
                    logger.info(f"Balance is low for {account_balance.login}. Started notifying")

                    for chat in alert.chat.all():
                        message = (
                                f'Оповещение о <b>необходимости пополнения</b> аккаунта <i>{account_balance.login}</i>!\n\n'
                                'Баланс: <b>' + '{:,.0f}'.format(account_balance.amount) + '₽</b>\n'
                        )
                        logger.info(f"Notifying {chat.chat_id}")
                        send_message_to_chat(chat.chat_id, message)
                    account.notified = True
                    account.save()
                elif account_balance.amount > account.min_sum:
                    account.notified = False
                    account.save()
