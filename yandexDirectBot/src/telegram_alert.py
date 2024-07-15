import telebot

from yandexDirectBot.settings import BOT_TOKEN

bot = telebot.TeleBot(BOT_TOKEN)


def send_message_to_chat(chat_id: str, message: str):
    bot.send_message(chat_id, message, parse_mode='html')
