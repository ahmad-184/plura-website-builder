import { NotificationsType } from "@/actions/notification";
import { User } from "@prisma/client";
import packDataByDate from "./packDataByDate";
import { Schema } from "zod";

export const returnUserDataUseCase = (data: User) => {
  return {
    id: data.id,
    agencyId: data.agencyId,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt,
    email: data.email,
    name: data.name,
    role: data.role,
    updatedAt: data.updatedAt,
  };
};

export const packNotificationsByDate = (
  notifs: NotificationsType
): { date: string; data: NotificationsType }[] => {
  const d = packDataByDate(notifs) as {
    [date: string]: NotificationsType | [];
  };

  let data: { date: string; data: NotificationsType }[] = [];
  for (let obj of Object.entries(d)) {
    data.push({
      date: obj[0],
      data: obj[1],
    });
  }

  return data;
};

export const ZodValidator = <T>(schema: Schema, data: T): T => {
  const res = schema.safeParse(data);
  if (!res.success) throw new Error(res.error.message);
  return res.data;
};
