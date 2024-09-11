"use server";

import { db } from "@/lib/db";
import { Account, AccountType, Invitation, Role, User } from "@prisma/client";
import { createHash, hashPassword } from "@/lib/use-case";
import { getCurrentUser, validateUser } from "./auth";
import { PublicError } from "@/lib/errors";

const TOKEN_TTL = 1000 * 60 * 5; // 5 min

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getUserAndAccountByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      include: {
        Account: true,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createUser = async (data: {
  name: string;
  email: string;
  id?: string;
  avatarUrl?: string;
}) => {
  try {
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        ...(data.id && { id: data.id }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export async function createAccount({
  type,
  userId,
  password,
  verified,
}: {
  type: AccountType;
  userId: string;
  password?: string;
  verified?: boolean;
}) {
  const account_exist = await db.account.findUnique({ where: { userId } });
  if (account_exist) await db.account.delete({ where: { userId } });

  let hash;

  if (password) {
    hash = await hashPassword(password, 10);
  }
  const account = await db.account.create({
    data: {
      userId,
      password: hash,
      type,
      emailVerified: verified || false,
    },
  });
  return account;
}

export const createVerifyOtp = async (userId: string, otp: string) => {
  try {
    const hashedOtp = await createHash(otp);

    const existing_varify_otp = await db.verifyEmailOtp.findUnique({
      where: {
        userId,
      },
    });

    if (existing_varify_otp) {
      await db.verifyEmailOtp.deleteMany({
        where: {
          userId,
        },
      });
    }

    const res = await db.verifyEmailOtp.create({
      data: {
        userId,
        expireAt: new Date(Date.now() + TOKEN_TTL),
        otp: hashedOtp,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteVerifyOtp = async (id: string) => {
  try {
    const res = await db.verifyEmailOtp.delete({
      where: {
        id,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getVerifyOtpByUserId = async (userId: string) => {
  try {
    const res = await db.verifyEmailOtp.findUnique({
      where: {
        userId,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createTeamUser = async (data: {
  agencyId: string;
  role: Role;
  userId: string;
}) => {
  try {
    if (data.role === "AGENCY_OWNER")
      throw new PublicError("AGENCY_OWNER role not allowed");
    const res = await updateUser(data.userId, {
      agencyId: data.agencyId,
      role: data.role,
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

export const getPermissionWithSubaccountId = async (
  email: string,
  subaccountId: string
) => {
  try {
    const res = await db.permissions.findFirst({
      where: {
        email,
        subAccountId: subaccountId,
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
      const res = await getCurrentUser();
      user_id = res?.id;
    }

    if (!user_id) throw new PublicError("user dos not exist");

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

export const updateManyUserByAgencyId = async (
  agencyId: string,
  data: Partial<User>
) => {
  try {
    const res = await db.user.updateMany({
      where: { agencyId },
      data,
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAccountId = async (id: string) => {
  try {
    const res = await db.account.findUnique({
      where: {
        id,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAccountByUserId = async (userId: string) => {
  try {
    const res = await db.account.findUnique({
      where: {
        userId,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateAccount = async (id: string, data: Partial<Account>) => {
  try {
    const res = await db.account.update({
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

export const getSubaccountTeamMembers = async (subaccountId: string) => {
  try {
    const user = await validateUser();

    const filter: Role[] =
      user.role === "SUBACCOUNT_USER" || user.role === "SUBACCOUNT_GUEST"
        ? ["AGENCY_OWNER", "AGENCY_ADMIN", "SUBACCOUNT_ADMIN"]
        : user.role === "SUBACCOUNT_ADMIN"
        ? ["AGENCY_OWNER", "AGENCY_ADMIN"]
        : user.role === "AGENCY_ADMIN"
        ? ["AGENCY_OWNER"]
        : [];

    const res = await db.user.findMany({
      where: {
        Agency: {
          SubAccount: {
            some: {
              id: subaccountId,
            },
          },
        },
        role: {
          notIn: filter,
        },
        Permissions: {
          some: {
            subAccountId: subaccountId,
            access: true,
          },
        },
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return [];
  }
};
