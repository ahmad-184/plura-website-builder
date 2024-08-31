"use server";

import { db } from "@/lib/db";

export const getSubaccountTags = async (subaccountId: string) => {
  try {
    const res = await db.tag.findMany({
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
