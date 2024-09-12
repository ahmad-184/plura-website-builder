"use server";

import { db } from "@/lib/db";

export const getSubaccountContacts = async (subaccountId: string) => {
  try {
    const res = await db.contact.findMany({
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
