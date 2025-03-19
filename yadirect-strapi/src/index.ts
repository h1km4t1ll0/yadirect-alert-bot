import {Strapi} from "@strapi/strapi";
import TelegramBot from "node-telegram-bot-api";
import {everyDayAlert} from "./cron-tasks/everyDayAlert";
import {balanceChangeAlert} from "./cron-tasks/balanceChangeAlert";


export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: {strapi: Strapi}) {
    const botToken = strapi.config.get('external.telegramBotProperties.telegramBotToken', '');
    strapi.bot = new TelegramBot(
      botToken,
      { polling: false },
    );
    //
    // await strapi.bot.deleteWebHook()
    //
    // if (!strapi.config.get('external.telegramBotProperties.longPoll', false)) {
    //   const domain = strapi.config.get('external.telegramBotProperties.domain', false)
    //   await strapi.bot.setWebHook(`https://${domain}/${botToken}`);
    // }
    //
    // strapi.bot.on('new_chat_members', async (msg) => {
    //   console.log(msg)
    // });
    //
    // strapi.bot.on('message', async (msg) => {
    //   await strapi.bot.sendMessage(msg.chat.id, msg.text);
    // });
  },
};
