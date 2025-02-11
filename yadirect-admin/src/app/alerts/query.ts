export const alertQuery = {
  populate: {
    projects: {
      populate: '*',
    },
    chats: {
      populate: '*',
    },
  },
};