import datetime
import logging

from celery.app import shared_task

from yandexDirectBot.models import Project
from yandexDirectBot.src.telegram_api import send_message_to_chat
from yandexDirectBot.src.utils import format_number
from yandexDirectBot.src.yandex_direct_api.api import YandexDirectAPI

logger = logging.getLogger(__name__)


@shared_task
def every_day_alert():
    projects = Project.objects.all()
    current_time = datetime.datetime.now().strftime('%H:%M:00')
    date_from = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    logger.info("Started every_day_alert job")
    yandex_direct_api = YandexDirectAPI()

    for project in projects:
        for alert in project.alerts.all():
            if str(alert.alert_time) == current_time:
                for account in project.yandex_direct_accounts.all():
                    account_report = yandex_direct_api.get_account_report(
                        account.api_key,
                        date_from,
                        project.goals
                    )

                    logger.info(f'Requesting data with goals: {project.goals}')

                    account_balance = yandex_direct_api.get_account_balance(
                        account.api_key
                    )

                    for chat in alert.chat.all():
                        if account_report.error_message:
                            logger.error(account_report.error_message)
                        if project.goals is not None and len(project.goals) > 0:
                            goals_data = ''
                            for goal_data in account_report.goals_data:
                                goals_data += (
                                    f'\n\nЦель: <i>{goal_data["goal"]}</i>\n'
                                    f'Цена конверсии: <b>{goal_data["cost"]}₽</b>\n'
                                    f'Конверсий: <b>{goal_data["conversions"]}</b>'
                                )

                            message = (
                                f'Ежедневный отчет по аккаунту <i>{account_balance.login}</i>\n'
                                f'Дата отчета: <b>{date_from}</b>\n\n'
                                f'Показы: <b>{account_report.impressions}</b>\n'
                                f'Клики: <b>{account_report.clicks}</b>\n'
                                f'Конверсии: <b>{account_report.conversions}</b>'
                                f'{goals_data}\n\n'
                                f'Расход: <b>{account_report.cost}₽</b>\n'
                                f'Расход с НДС: <b> {account_report.cost_with_vat}₽</b>\n'
                                f'Баланс на {datetime.datetime.now().strftime("%Y-%m-%d")}: '
                                f'<b>{format_number(account_balance.amount)}₽</b>\n'
                            )
                        else:
                            message = (
                                f'Ежедневный отчет по аккаунту <i>{account_balance.login}</i>\n'
                                f'Дата отчета: <b>{date_from}</b>\n\n'
                                f'Показы: <b>{account_report.impressions}</b>\n'
                                f'Клики: <b>{account_report.clicks}</b>\n'
                                f'Конверсии: <b>{account_report.conversions}</b>\n'
                                f'Расход: <b>{account_report.cost}₽</b>\n'
                                f'Расход с НДС: <b> {account_report.cost_with_vat}₽</b>\n'
                                f'Баланс на {datetime.datetime.now().strftime("%Y-%m-%d")}: '
                                f'<b>{format_number(account_balance.amount)}₽</b>\n'
                            )
                        logger.info(f'Account report: {account_report.__dict__}')
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
                elif account_balance.amount >= account.min_sum and account.notified:
                    for chat in alert.chat.all():
                        message = (
                                f'Баланс аккаунта <i>{account_balance.login}</i> пополнен!\n\n'
                                'Текущий баланс: <b>' + '{:,.0f}'.format(account_balance.amount) + '₽</b>\n'
                        )
                        logger.info(f"Notifying {chat.chat_id}")
                        send_message_to_chat(chat.chat_id, message)

                    account.notified = False
                    account.save()
