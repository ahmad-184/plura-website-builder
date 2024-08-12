"use server";

import { db } from "@/lib/db";
import { SidebarType } from "@/types";
import { Notification, User } from "@prisma/client";

export const createNotification = async (
  data: Omit<Notification, "createdAt" | "updatedAt" | "id">
) => {
  try {
    const res = await db.notification.create({ data });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAgencyNotificationsAndUser = async (agencyId: string) => {
  try {
    const res = await db.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSubAccountNotificationsAndUser = async (subId: string) => {
  try {
    const res = await db.notification.findMany({
      where: { subAccountId: subId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export type NotificationsType = (Notification & { User: User })[];

export const getNotificationsByType = async (type: SidebarType, id: string) => {
  try {
    let notifs: NotificationsType | [] | null = [];

    if (type === "agency") notifs = await getAgencyNotificationsAndUser(id);
    if (type === "subaccount")
      notifs = await getSubAccountNotificationsAndUser(id);

    return notifs;
  } catch (err) {
    console.log(err);
    return null;
  }
};
