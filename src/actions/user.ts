"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Invitation, User } from "@prisma/client";
import { cache } from "react";
import { User as UserClerk } from "@clerk/nextjs/server";

export const getCurrentUser = cache(async () => {
  try {
    const res = await currentUser();
    return JSON.parse(JSON.stringify(res)) as UserClerk;
  } catch (err) {
    console.log(err);
    return null;
  }
});

export const getCurrentUserData = cache(async () => {
  try {
    const user_id = await auth().userId;
    if (!user_id) return null;
    const res = await db.user.findUnique({
      where: {
        id: user_id,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
});

export const createTeamUser = async (data: User) => {
  try {
    if (data.role === "AGENCY_OWNER")
      throw new Error("AGENCY_OWNER role not allowed");
    const res = await db.user.create({
      data,
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAgencyTeamMembers = async (agencyId: string) => {
  try {
    const res = await db.user.findMany({
      where: {
        agencyId,
      },
      include: {
        Permissions: {
          include: {
            SubAccount: true,
          },
        },
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAgencyTeamMember = async (agencyId: string) => {
  try {
    const res = await db.user.findFirst({
      where: {
        agencyId,
      },
      include: {
        Permissions: {
          include: {
            SubAccount: true,
          },
        },
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const res = await db.user.findUnique({ where: { email } });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getUserPermissions = async (email: string) => {
  try {
    const res = await db.permissions.findMany({
      where: {
        email,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getUserDataWithPermissionsAndSubaccounts = async (id?: string) => {
  try {
    let user_id = id;

    if (!user_id) {
      const res = await getCurrentUserData();
      user_id = res?.id;
    }

    if (!user_id) throw new Error("user dos not exist");

    const res = await db.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        Permissions: {
          include: {
            SubAccount: true,
          },
        },
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const findASubaccountWithUserAccess = async (email: string) => {
  try {
    const res = await db.permissions.findFirst({
      where: {
        email,
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

export const updateUser = async (id: string, data: Partial<User>) => {
  try {
    const res = await db.user.update({
      where: { id },
      data,
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createInvitation = async (data: Omit<Invitation, "id">) => {
  try {
    const res = await db.invitation.upsert({
      where: {
        email: data.email,
      },
      update: { ...data },
      create: {
        email: data.email,
        agencyId: data.agencyId,
        role: data.role,
        status: "PENDING",
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};
