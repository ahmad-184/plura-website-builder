import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const createTeamUser = async (data: User) => {
  if (data.role === "AGENCY_OWNER")
    throw new Error("AGENCY_OWNER role not allowed");
  return await db.user.create({
    data,
  });
};

export const findUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};
