"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";

export const getSubaccountContacts = async (subaccountId: string) => {
  try {
    const res = await db.contact.findMany({
      where: {
        subAccountId: subaccountId,
      },
    });
    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
