"use server";

import { db } from "@/lib/db";
import { createNotification } from "./notification";
import { SidebarType } from "@/types";
import { AgencySidebarOption, SubAccountSidebarOption } from "@prisma/client";
import { getCurrentUser } from "./user";

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
    } else
      find_user = await db.user.findUnique({
        where: {
          email: user?.emailAddresses[0].emailAddress,
        },
      });

    if (!find_user) return;

    const role =
      find_user.role === "AGENCY_OWNER"
        ? "Owner"
        : find_user.role === "AGENCY_ADMIN"
        ? "Admin"
        : find_user.role === "SUBACCOUNT_USER"
        ? "User"
        : find_user.role === "SUBACCOUNT_GUEST"
        ? "Guest"
        : "";

    await createNotification({
      agencyId: agencyId || null,
      subAccountId: subaccountId || null,
      userId: find_user.id,
      notification: `${find_user.name}(${role}) | ${description}`,
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
