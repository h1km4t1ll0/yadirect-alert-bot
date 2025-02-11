import {balanceChangeAlert} from "../src/cron-tasks/balanceChangeAlert";
import {everyDayAlert} from "../src/cron-tasks/everyDayAlert";

export default {
  // ПРИМЕР ТАЙМИНГОВ
  // rule: '0    0    12   *    *    *',
  //        *    *    *    *    *    *
  //        ┬    ┬    ┬    ┬    ┬    ┬
  //        │    │    │    │    │    |
  //        │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  //        │    │    │    │    └───── month (1 - 12)
  //        │    │    │    └────────── day of month (1 - 31)
  //        │    │    └─────────────── hour (0 - 23)
  //        │    └──────────────────── minute (0 - 59)
  //        └───────────────────────── second (0 - 59, OPTIONAL)
  makeBalanceChangeAlert: {
    task: balanceChangeAlert,
    options: {
      tz: 'Europe/Moscow',
      rule: '0   0   *    *    *    *',
    },
  },
  makeLeadPhoneExternalValidation: {
    task: everyDayAlert,
    options: {
      tz: 'Europe/Moscow',
      rule: '0   */10   *    *    *    *',
    },
  },
};
