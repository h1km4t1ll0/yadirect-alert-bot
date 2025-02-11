import TelegramBot from "node-telegram-bot-api";

declare module '@strapi/strapi' {
  export { Strapi as IStrapi } from '@strapi/strapi';

  export interface Strapi extends IStrapi {
    bot?: TelegramBot;
    isRunningBalanceChangeAlert?: boolean;
    isRunningEveryDayAlert?: boolean;
  }
}
