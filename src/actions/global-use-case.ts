"use server";

import { db } from "@/lib/db";
import { createNotification } from "./notification";
import { SidebarType } from "@/types";
import { AgencySidebarOption, SubAccountSidebarOption } from "@prisma/client";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { TooManyRequest } from "@/lib/errors";
import { getCurrentUser } from "./auth";

export const saveActivityLogsNotification = async ({
  agencyId,
  subaccountId,
  description,
}: {
  agencyId?: string;
  subaccountId?: string;
  description: string;
}) => {
  try {
    const user = await getCurrentUser();
    let find_user;

    if (!user) {
      find_user = await db.user.findFirst({
        where: {
          Agency: {
            SubAccount: {
              some: {
                id: subaccountId,
              },
            },
          },
        },
      });
    } else find_user = user;

    if (!find_user) return;

    await createNotification({
      agencyId: agencyId || null,
      subAccountId: subaccountId || null,
      userId: find_user.id,
      notification: `${find_user.name} | ${description}`,
    });

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSidebarOptions = async (type: SidebarType, id: string) => {
  try {
    let options: AgencySidebarOption[] | SubAccountSidebarOption[] | [] = [];

    if (type === "agency")
      options = await db.agencySidebarOption.findMany({
        where: {
          agencyId: id,
        },
      });
    if (type === "subaccount")
      options = await db.subAccountSidebarOption.findMany({
        where: {
          subAccountId: id,
        },
      });

    return options;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAgencyOrSubAccount = async (type: SidebarType, id: string) => {
  try {
    let data;

    if (type === "agency") data = await db.agency.findUnique({ where: { id } });
    if (type === "subaccount")
      data = await db.subAccount.findUnique({ where: { id } });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSubaccountAndMedia = async (subaccountId: string) => {
  try {
    const res = await db.subAccount.findUnique({
      where: {
        id: subaccountId,
      },
      include: {
        Media: true,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSubaccountMedias = async (subaccountId: string) => {
  try {
    const res = await db.media.findMany({
      where: {
        subAccountId: subaccountId,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getMedia = async (id: string) => {
  try {
    const res = await db.media.findUnique({
      where: {
        id,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const rateLimitter = async ({
  limit = 3,
  duration = 25,
  identifier,
}: {
  limit?: number;
  duration?: number;
  identifier?: string;
}) => {
  const header = await headers();
  const ip = header.get("x-forwarded-for") as string;
  const rateLimitter = await rateLimit({ limit, duration });
  const { success } = await rateLimitter.limit(identifier || ip);
  if (!success) throw new TooManyRequest();
};
