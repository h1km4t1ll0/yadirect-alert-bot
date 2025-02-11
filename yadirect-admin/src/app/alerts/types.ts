import {Chat} from "@app/chats/types";
import {Project} from "@app/projects/types";

export type Alert = {
  alertTime: string,
  projects: Project[],
  chats: Chat[],

  createdAt: Date,
  updatedAt: Date,
  id: number | string,
};
