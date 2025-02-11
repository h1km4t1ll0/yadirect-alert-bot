import cronTasks from "./cronTasks";

export default ({ env }) => {
  const isCronEnabled = env('CRON_ENABLED', false);
  if (!isCronEnabled) {
    console.warn('\nОтключены cron задания\n');
  }

  return ({
    host: env('HOST', '0.0.0.0'),
    keys: ['myKeyA', 'myKeyB'],
    port: env.int('PORT', 1337),
    app: {
      keys: env.array('APP_KEYS'),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
    cron: {
      enabled: isCronEnabled,
      tasks: cronTasks,
    },
  });
}
