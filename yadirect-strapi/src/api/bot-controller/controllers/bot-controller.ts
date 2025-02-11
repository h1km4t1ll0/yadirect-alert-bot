export default {
  processUpdate: async (ctx, _) => {
    strapi.bot.processUpdate(JSON.parse(ctx.request.body))
    return ctx.send(`ok`, 200);
  },
};
