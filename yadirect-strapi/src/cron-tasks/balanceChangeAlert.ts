import {sendMessageToChat} from "./yandex-api/utils";
import {YandexDirectAPI} from "./yandex-api"; // Import your Yandex Direct API wrapper


const processBalanceChangeAlert = async (
  {yandexDirectApi, account, project}: {
    account: {
      token: string,
      isUserNotified?: boolean,
      balance?: number,
      alertBalanceAmount?: number,
      id: string | number,
      name: string,
    },
    yandexDirectApi: YandexDirectAPI,
    project: {
      alerts?: {
        chats?: {
          chatId: string,
        }[],
      }[],
    },
  }
) => {
  try {
    const accountBalance = await yandexDirectApi.getAccountBalance(account.token);

    console.log(accountBalance, 'accountBalance')

    if (accountBalance.amount < account.alertBalanceAmount && !account.isUserNotified) {
      console.info(`Balance is low for ${accountBalance.login}. Started notifying`);
      for (const alert of project.alerts) {
        const message = `
Оповещение о <b>необходимости пополнения</b> аккаунта <i>${account.name} (${accountBalance.login})</i>!

Баланс: <b>${accountBalance.amount.toLocaleString('ru-RU')}₽</b>`;
        for (const chat of alert.chats) {
          console.info(`Notifying ${chat.chatId}`);
          await sendMessageToChat(chat.chatId, message);
        }
      }

      await strapi.entityService.update('api::yandex-direct-account.yandex-direct-account', account.id, {
        data: {
          isUserNotified: true,
        },
      });
    } else if (accountBalance.amount >= account.alertBalanceAmount && account.isUserNotified) {
      for (const alert of project.alerts) {
        const message = `
Баланс аккаунта <i>${account.name} (${accountBalance.login})</i> пополнен!

Текущий баланс: <b>${accountBalance.amount.toLocaleString('ru-RU')}₽</b>`;
        for (const chat of alert.chats) {
          console.info(`Notifying ${chat.chatId}`);
          await sendMessageToChat(chat.chatId, message);
        }
      }
      await strapi.entityService.update('api::yandex-direct-account.yandex-direct-account', account.id, {
        data: {
          isUserNotified: false,
        },
      });
    }
  } catch (e) {
    console.error(e);
  }
}

export const balanceChangeAlert = async () => {
  const projects = await strapi.entityService.findMany('api::project.project', {
    populate: {
      alerts: {
        populate: '*',
      },
      yandexDirectAccounts: {
        populate: '*',
      },
    },
  });
  const yandexDirectApi = new YandexDirectAPI();
  console.info("Started balanceChangeAlert job");

  const promisesToExecute: Promise<void>[] = [];

  projects.forEach((project) => {
    project.yandexDirectAccounts.forEach((account) => promisesToExecute.push(processBalanceChangeAlert({
      yandexDirectApi,
      account,
      project,
    })));
  });

  await Promise.all(promisesToExecute);
}
