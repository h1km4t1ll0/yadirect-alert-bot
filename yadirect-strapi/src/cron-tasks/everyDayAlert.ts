import {YandexDirectAPI} from './yandex-api'; // Assuming YandexDirectAPI is imported from a module
import {formatNumber, sendMessageToChat} from './yandex-api/utils'; // Assuming formatNumber is imported from a utility module
import {DateTime} from 'luxon'; // For date handling

type HandleEveryDayAlertProps = {
  yandexDirectApi: YandexDirectAPI,
  accountToken: string,
  goals: {
    name: string,
    goalId: string
  }[],
  accountName: string,
  dateFrom: string,
  chats: {
    chatId: string
  }[]
};

const handleEveryDayAlert = async (
  {
    yandexDirectApi,
    accountToken,
    goals,
    accountName,
    dateFrom,
    chats
  }: HandleEveryDayAlertProps
) => {
  const accountReport = await yandexDirectApi.getAccountReport(
    accountToken,
    dateFrom,
    goals,
  );
  const accountBalance = await yandexDirectApi.getAccountBalance(accountToken);

  if (accountReport.errorMessage) {
    console.error(accountReport.errorMessage);
  }

  let message: string;
  if (goals && goals.length > 0) {
    let goalsData = '';
    for (const goalData of accountReport.goalsData) {
      goalsData += `
Цель: <i>${goalData.goal}</i>
Цена конверсии: <b>${goalData.cost}₽</b>
Конверсий: <b>${goalData.conversions}</b>`;
    }
    message = `
Ежедневный отчет по аккаунту <i>${accountName}</i>
Дата отчета: <b>${dateFrom}</b>
Показы: <b>${accountReport.impressions}</b>
Клики: <b>${accountReport.clicks}</b>
Конверсии: <b>${accountReport.conversions}</b>${goalsData}
Расход: <b>${accountReport.cost}₽</b>
Расход с НДС: <b>${accountReport.costWithVat}₽</b>
Баланс на ${DateTime.now().toFormat('yyyy-MM-dd')}: <b>${formatNumber(accountBalance.amount)}₽</b>\n`;
  } else {
    message = `
Ежедневный отчет по аккаунту <i>${accountName}</i>
Дата отчета: <b>${dateFrom}</b>
Показы: <b>${accountReport.impressions}</b>
Клики: <b>${accountReport.clicks}</b>
Конверсии: <b>${accountReport.conversions}</b>
Расход: <b>${accountReport.cost}₽</b>
Расход с НДС: <b>${accountReport.costWithVat}₽</b>
Баланс на ${DateTime.now().toFormat('yyyy-MM-dd')}: <b>${formatNumber(accountBalance.amount)}₽</b>`;
  }

  console.info(`Account report: ${JSON.stringify(accountReport)}`);
  for (const chat of chats) {
    console.info(`Notified ${chat.chatId}`);
    await sendMessageToChat(chat.chatId, message);
  }
}

export const everyDayAlert = async () => {
  const currentTime = DateTime.now().toFormat('HH:mm:00');
  const projects = await strapi.entityService.findMany('api::project.project', {
    populate: {
      alerts: {
        filters: {
          alertTime: {
            $eq: currentTime,
          },
        },
        populate: '*',
      },
      yandexDirectAccounts: {
        populate: '*',
      },
    },
  }); // Fetch all projects
  const dateFrom = DateTime.now().minus({days: 1}).toFormat('yyyy-MM-dd');

  console.info("Started every_day_alert job");
  const yandexDirectApi = new YandexDirectAPI();

  const promisesToExecute: Promise<void>[] = [];
  projects.filter((project) => project.alerts.length > 0).forEach((project) => {
    project.alerts.forEach((alert) => {
      project.yandexDirectAccounts.forEach((account) => {
        promisesToExecute.push(
          handleEveryDayAlert({
            yandexDirectApi,
            accountToken: account.token,
            goals: account.goals.map(
              (goal) => ({
                name: goal.name,
                goalId: goal.goalId
              }),
            ),
            accountName: account.name,
            dateFrom,
            chats: alert.chats,
        }));
      });
    });
  });

  await Promise.all(promisesToExecute);
}
