export default {
  routes: [
    {
      method: 'POST',
      path: `/${strapi.config.get('external.telegramBotProperties.telegramBotToken', '')}`,
      handler: 'bot-controller.processUpdate',
    },
  ],
};
