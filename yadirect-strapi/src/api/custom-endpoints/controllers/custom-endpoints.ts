export default {
  sendTestAlert: async (ctx, next) => {
    const chatId = ctx.query?.chatId;

    try {
      await strapi.bot.sendMessage(chatId, "Тестовое уведомление для проверки работы бота WebGib");

      return ctx.send({
        success: true,
        error: null,
      }, 200);
    } catch (e) {
      console.error(`[SEND TEST ALERT ERROR] ${JSON.stringify(e)}`);

      if (e?.message?.includes('chat not found')) {
        return ctx.send({
          success: false,
          error: `Бота нет в чате!`,
        }, 200);
      }

      return ctx.send({
        success: false,
        error: null,
      }, 200);
    }
  },
};
