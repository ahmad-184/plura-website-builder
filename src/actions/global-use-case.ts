import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { createNotification } from "./notification";
import { SidebarType } from "@/types";
import { AgencySidebarOption, SubAccountSidebarOption } from "@prisma/client";

export const saveActivityLogsNotification = async ({
  agencyId,
  subaccountId,
  description,
}: {
  agencyId?: string;
  subaccountId?: string;
  description: string;
}) => {
  const user = await currentUser();
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

  if (find_user) {
    if (!agencyId && subaccountId) {
      const res = await db.subAccount.findUnique({
        where: { id: subaccountId },
      });
      agencyId = res?.agencyId;
    }

    if (agencyId && subaccountId) {
      await createNotification({
        agencyId,
        subAccountId: subaccountId,
        userId: find_user.id,
        notification: `${find_user.name} | ${description}`,
      });
    } else if (agencyId && !subaccountId) {
      await createNotification({
        agencyId,
        subAccountId: null,
        userId: find_user.id,
        notification: `${find_user.name} | ${description}`,
      });
    }

    return;
  }
};

export const getSidebarOptions = async (type: SidebarType, id: string) => {
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
};
