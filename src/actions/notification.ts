import { db } from "@/lib/db";
import { Notification } from "@prisma/client";

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
