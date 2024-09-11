"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

export const getSubAccount = async (id: string) => {
  try {
    const res = await db.subAccount.findUnique({
      where: { id },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAgencySubAccounts = async (agencyId: string) => {
  try {
    const res = await db.subAccount.findMany({
      where: { agencyId },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSubAccountsByIds = async (ids: string[]) => {
  try {
    if (!ids.length) return [];
    const res = await db.subAccount.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSubaccountWithAccessWithIdAndEmail = async (
  sub_id: string,
  user_email: string
) => {
  try {
    const res = await db.permissions.findFirst({
      where: {
        email: user_email,
        subAccountId: sub_id,
        access: true,
      },
      include: {
        SubAccount: true,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getCurrentUserSubaccounts = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return redirect("/");
    const subs = await db.permissions.findMany({
      where: { email: user.email },
      include: {
        SubAccount: true,
      },
    });

    return subs.map((e) => e.SubAccount);
  } catch (err) {
    console.log(err);
    return null;
  }
};
