import {Project} from "@app/projects/types";

export type Goal = {
  name: string,
  goalId: string,
};

export type YandexDirectAccount = {
  token: string,
  name: string,
  alertBalanceAmount: number,
  monthlyBudget: number,

  goals: Goal[],
  project: Project,

  createdAt: Date,
  updatedAt: Date,
  id: number | string,
};
