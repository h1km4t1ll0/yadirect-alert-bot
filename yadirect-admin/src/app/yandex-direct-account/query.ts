export const yandexDirectAccountQuery = {
  populate: {
    project: {
      populate: '*',
    },
    goals: {
      populate: '*',
    },
  },
};