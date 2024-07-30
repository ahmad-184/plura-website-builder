import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

export const getCurrentUserData = async () => {
  const user_id = await auth().userId;
  if (!user_id) return null;
  return await db.user.findUnique({
    where: {
      id: user_id,
    },
  });
};

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

export const getUserPermissions = async (id: string) => {
  return await db.permissions.findMany({
    where: {
      id,
    },
  });
};
