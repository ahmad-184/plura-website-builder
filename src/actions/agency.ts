import { db } from "@/lib/db";

export const getAgency = async (id: string) => {
  return await db.agency.findUnique({ where: { id } });
};
