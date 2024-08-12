"use server";

import { db } from "@/lib/db";

export const getAgency = async (id: string) => {
  try {
    const res = await db.agency.findUnique({ where: { id } });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};
