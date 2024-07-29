import { db } from "@/lib/db";

export const getSubAccount = async (id: string) => {
  return await db.subAccount.findUnique({
    where: { id },
  });
};
