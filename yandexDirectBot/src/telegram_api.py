import logging

import telebot

from yandexDirectBot.models import Chat
from yandexDirectBot.settings import BOT_TOKEN, SERVER_MODE, DOMAIN

bot = telebot.TeleBot(BOT_TOKEN)


def do_webhook():
    if SERVER_MODE:
        bot.set_webhook(url=f'https://{DOMAIN}/{BOT_TOKEN}')
    else:
        bot.remove_webhook()


def send_message_to_chat(chat_id: str, message: str):
    bot.send_message(chat_id, message, parse_mode='html')


@bot.message_handler(content_types=["new_chat_members"])
def add_bot_to_chat_handler(message: telebot.types.Message):
    if bot.get_me().id in map(lambda chat_member: chat_member.id, message.new_chat_members):
        chats = Chat.objects.filter(chat_id=message.chat.id)

        if len(chats) > 0:
            bot.send_message(
                message.chat.id,
                f'Чат <i>{message.chat.title}</i> был добавлен ранее. '
                'Можете продолжить настройку в админ-панели.',
                parse_mode='html',
            )
        else:
            try:
                chat = Chat()
                chat.name = message.chat.title
                chat.chat_id = message.chat.id
                chat.save()

                bot.send_message(
                    message.chat.id,
                    f'Чат <i>{message.chat.title}</i> добавлен. Можете продолжить настройку в админ-панели.',
                    parse_mode='html',
                )
            except Exception as e:
                logging.error(f'Ошибка при добавлении чата! {str(e)}')
                bot.send_message(
                    message.chat.id,
                    f'Произошла ошибка при добавлении чата <i>{message.chat.title}</i>.\n\n'
                    f'Добавьте его вручную в админ-панели. ID чата: <i>{message.chat.id}</i>',
                    parse_mode='html',
                )
