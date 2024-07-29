"use server";

import { db } from "@/lib/db";
import { authenticatedAction } from "@/lib/safe-action";
import { createTeamUser, findUserByEmail } from "./user";
import { saveActivityLogsNotification } from "./global-use-case";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { agencyDetailFormSchema, subAccountDetailFormSchema } from "@/zod";
import { v4 } from "uuid";

export const getUserAuthDetailsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const userData = await db.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
      include: {
        Agency: {
          include: {
            SidebarOption: true,
            SubAccount: {
              include: {
                SidebarOption: true,
              },
            },
          },
        },
        Permissions: true,
      },
    });

    return userData;
  });

export const verifyAndAcceptInvitationAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const invitation_exist = await db.invitation.findUnique({
      where: { email: user.emailAddresses[0].emailAddress, status: "PENDING" },
    });

    if (!invitation_exist) {
      const res = await findUserByEmail(user.emailAddresses[0].emailAddress);

      return res?.agencyId || null;
    }

    const new_user = await createTeamUser({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: invitation_exist.email,
      avatarUrl: "",
      agencyId: invitation_exist.agencyId,
      role: invitation_exist.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!new_user) return null;

    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role: new_user.role || "SUBACCOUNT_USER",
      },
    });

    await saveActivityLogsNotification({
      agencyId: invitation_exist.agencyId,
      description: "Joined",
      subaccountId: undefined,
    });

    await db.invitation.delete({ where: { email: new_user.email } });

    return new_user.agencyId;
  });

export const createAgencyAction = authenticatedAction
  .createServerAction()
  .input(
    agencyDetailFormSchema.and(
      z.object({ customerId: z.string(), id: z.string() })
    )
  )
  .handler(async ({ input }) => {
    if (!input.companyEmail) throw new Error("company email reqiured");

    const res = await db.agency.create({
      data: {
        ...input,
        connectAccountId: "",
        customerId: input.customerId,
        users: {
          connect: {
            email: input.companyEmail,
          },
        },
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${input.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${input.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${input.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${input.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${input.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${input.id}/team`,
            },
          ],
        },
      },
    });

    return res;
  });

export const updateAgencyAction = authenticatedAction
  .createServerAction()
  .input(
    agencyDetailFormSchema.and(
      z.object({
        id: z.string(),
      })
    )
  )
  .handler(async ({ input }) => {
    const user = await currentUser();
    if (!user) throw new Error("accecc denied");

    const agencyId = input.id;
    if (!agencyId) throw new Error("agency id required");

    await db.agency.update({ where: { id: agencyId }, data: input });

    await saveActivityLogsNotification({
      agencyId: agencyId,
      description: "Agency information updated",
      subaccountId: undefined,
    });

    return true;
  });

export const deleteAgencyAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      agencyId: z.string().min(1, { message: "agency id required" }),
    })
  )
  .handler(async ({ ctx: { user }, input }) => {
    const { agencyId } = input;
    const agency_exist = await db.agency.findUnique({
      where: {
        id: agencyId,
      },
    });
    if (!agency_exist) throw new Error("agency dos not exist");
    if (agency_exist.companyEmail !== user.emailAddresses[0].emailAddress)
      throw new Error("access denied");

    await db.agency.delete({ where: { id: agencyId } });

    return true;
  });

export const updateGoalAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      goal: z.number().min(1, { message: "agency id required" }),
      agencyId: z.string().min(1, { message: "agency id required" }),
    })
  )
  .handler(async ({ input }) => {
    await db.agency.update({
      where: { id: input.agencyId },
      data: { goal: input.goal },
    });

    await saveActivityLogsNotification({
      agencyId: input.agencyId,
      description: "Agency goal updated",
      subaccountId: undefined,
    });

    return true;
  });

export const initUserAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      role: z.enum([
        "AGENCY_OWNER",
        "AGENCY_ADMIN",
        "SUBACCOUNT_USER",
        "SUBACCOUNT_GUEST",
      ]),
      agencyId: z.string(),
    })
  )
  .handler(async ({ ctx: { user }, input }) => {
    const user_exist = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    if (user_exist) throw new Error("a user with this email already exist");

    const new_user = await db.user.create({
      data: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        avatarUrl: "",
        agencyId: input.agencyId,
        role: input.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role: input.role,
      },
    });

    return new_user;
  });

export const createSubAccountAction = authenticatedAction
  .createServerAction()
  .input(
    subAccountDetailFormSchema.and(
      z.object({ id: z.string(), agencyId: z.string() })
    )
  )
  .handler(async ({ input }) => {
    const user = await currentUser();
    if (!input.companyEmail) throw new Error("company email reqiured");

    if (
      !user ||
      (user.privateMetadata.role !== "AGENCY_ADMIN" &&
        user.privateMetadata.role !== "AGENCY_OWNER")
    )
      throw new Error("accecc denied");

    const agencyOwner = await db.user.findFirst({
      where: {
        role: "AGENCY_OWNER",
        agencyId: input.agencyId,
      },
    });

    if (!agencyOwner) throw new Error("accecc denied");

    const permissionId = v4();

    const res = await db.subAccount.create({
      data: {
        ...input,
        agencyId: input.agencyId,
        id: input.id,
        Permissions: {
          create: {
            access: true,
            email: agencyOwner.email,
            id: permissionId,
          },
          connect: {
            subAccountId: input.id,
            id: permissionId,
          },
        },
        Pipeline: {
          create: [{ name: "Lead Cycle" }],
        },
        SidebarOption: {
          create: [
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/subaccount/${input.id}/launchpad`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/subaccount/${input.id}/settings`,
            },
            {
              name: "Funnels",
              icon: "pipelines",
              link: `/subaccount/${input.id}/funnels`,
            },
            {
              name: "Media",
              icon: "database",
              link: `/subaccount/${input.id}/media`,
            },
            {
              name: "Automations",
              icon: "chip",
              link: `/subaccount/${input.id}/automations`,
            },
            {
              name: "Pipelines",
              icon: "flag",
              link: `/subaccount/${input.id}/pipelines`,
            },
            {
              name: "Contacts",
              icon: "person",
              link: `/subaccount/${input.id}/contacts`,
            },
            {
              name: "Dashboard",
              icon: "category",
              link: `/subaccount/${input.id}`,
            },
          ],
        },
      },
    });

    await saveActivityLogsNotification({
      agencyId: input.agencyId,
      description: `Account "${input.name}" created`,
      subaccountId: undefined,
    });

    return res;
  });

export const updateSubAccountAction = authenticatedAction
  .createServerAction()
  .input(
    subAccountDetailFormSchema.and(
      z.object({
        id: z.string(),
        agencyId: z.string(),
      })
    )
  )
  .handler(async ({ input }) => {
    const user = await currentUser();
    if (
      !user ||
      (user.privateMetadata.role !== "AGENCY_ADMIN" &&
        user.privateMetadata.role !== "AGENCY_OWNER")
    )
      throw new Error("access denied");

    const agencyOwner = await db.user.findFirst({
      where: {
        role: "AGENCY_OWNER",
        agencyId: input.agencyId,
      },
    });

    if (!agencyOwner) throw new Error("access denied");

    const subAccountId = input.id;
    if (!subAccountId) throw new Error("agency id required");

    await db.subAccount.update({ where: { id: subAccountId }, data: input });

    await saveActivityLogsNotification({
      agencyId: input.agencyId,
      description: "Account information updated",
      subaccountId: subAccountId,
    });

    return true;
  });

export const deleteSubAccountAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      subAccountId: z.string().min(1, { message: "agency id required" }),
    })
  )
  .handler(async ({ ctx: { user }, input }) => {
    if (
      user.privateMetadata.role !== "AGENY_OWNER" &&
      user.privateMetadata.role !== "AGENY_ADMIN"
    )
      throw new Error("access denied");
    const { subAccountId } = input;
    const account_exist = await db.subAccount.findUnique({
      where: {
        id: subAccountId,
      },
    });
    if (!account_exist) throw new Error("account dos not exist");
    if (account_exist.companyEmail !== user.emailAddresses[0].emailAddress)
      throw new Error("access denied");

    await db.agency.delete({ where: { id: subAccountId } });

    return true;
  });
