import {Alert} from "@app/alerts/types";

export type Chat = {
  alerts: Alert[],
  chatId: string,
  name: string,

  createdAt: Date,
  updatedAt: Date,
  id: number | string,
};
