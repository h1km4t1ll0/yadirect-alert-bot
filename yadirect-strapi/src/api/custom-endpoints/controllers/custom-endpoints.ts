export default {
  syncWithGoogle: async (ctx, next) => {
    try {
      const chatId = ctx.query.chatId;

      await strapi.bot.sendMessage(ctx.query.chatId, "Работаем!");
      ctx.send({
        message: 'Успешно!'
      }, 200);
    } catch (e) {
      console.error(`Ошибка! ${e}`);
      ctx.send({
        message: e.toString(),
      }, 500);
    }
  },
};