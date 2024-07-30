import { db } from "@/lib/db";

export const getSubAccount = async (id: string) => {
  return await db.subAccount.findUnique({
    where: { id },
  });
};

export const getSubAccountsByIds = async (ids: string[]) => {
  return await db.subAccount.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
