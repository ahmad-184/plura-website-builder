import { db } from "@/lib/db";
import { SidebarType } from "@/types";
import { Notification, User } from "@prisma/client";

export const createNotification = async (
  data: Omit<Notification, "createdAt" | "updatedAt" | "id">
) => {
  return await db.notification.create({ data });
};

export const getAgencyNotificationsAndUser = async (agencyId: string) => {
  return await db.notification.findMany({
    where: { agencyId },
    include: { User: true },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSubAccountNotificationsAndUser = async (subId: string) => {
  return await db.notification.findMany({
    where: { subAccountId: subId },
    include: { User: true },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export type NotificationsType = (Notification & { User: User })[];

export const getNotificationsByType = async (type: SidebarType, id: string) => {
  let notifs: NotificationsType | [] = [];

  if (type === "agency") notifs = await getAgencyNotificationsAndUser(id);
  if (type === "subaccount")
    notifs = await getSubAccountNotificationsAndUser(id);

  return notifs;
};
