import {Alert} from "@app/alerts/types";
import {YandexDirectAccount} from "@app/yandex-direct-account/types";

export type User = {
  username: string,
  email: string,
  role: string[],
};

export type Project = {
  alerts: Alert[],
  yandexDirectAccounts: YandexDirectAccount[],
  owner: User,

  name: string,

  createdAt: Date,
  updatedAt: Date,
  id: number | string,
};
