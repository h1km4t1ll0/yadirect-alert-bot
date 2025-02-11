export default ({ env }) => ({
  telegramBotProperties: {
    telegramBotToken: env('BOT_TOKEN', ''),
    longPoll: env.bool('LONG_POLL', true),
    domain: env('DOMAIN', ''),
  },
});
