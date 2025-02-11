export const projectQuery = {
  populate: {
    alerts: {
      populate: '*',
    },
    yandexDirectAccounts: {
      populate: '*',
    },
    owner: {
      populate: '*',
    },
  },
};