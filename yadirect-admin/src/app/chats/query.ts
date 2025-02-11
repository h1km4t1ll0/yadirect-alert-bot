export const chatQuery = {
  populate: {
    alerts: {
      populate: '*',
    },
  },
};