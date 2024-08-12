"use server";

import { db } from "@/lib/db";
import {
  createInvitation,
  createTeamUser,
  findUserByEmail,
  getCurrentUser,
  getCurrentUserData,
  updateUser,
} from "./user";
import { getMedia, saveActivityLogsNotification } from "./global-use-case";
import { clerkClient } from "@clerk/nextjs/server";
import {
  changeUserPermissionActionSchema,
  createAgencyActionSchema,
  createPipelineSchema,
  createSubaccountActionSchema,
  deleteAgencyActionSchema,
  deleteMediaActionSchema,
  deletePipelineActionSchema,
  deleteSubaccountActionSchema,
  deleteUserActionSchema,
  initUserActionSchema,
  sendInvitationSchema,
  updateAgencyActionSchema,
  updateGoalActionSchema,
  updatePipelineActionSchema,
  updateSubaccountActionSchema,
  updateUserActionSchema,
  uploadMediaActionSchema,
} from "@/zod";
import { v4 } from "uuid";
import { getSubAccount } from "./subaccount";
import { emailSender } from "@/lib/email";
import invitationTemplate from "@/emails/invitation";
import { getAgency } from "./agency";
import { env } from "@/env";
import { createPipeline, deletePipeline, updatePipeline } from "./pipeline";
import { ZodValidator } from "@/lib/use-case";
import {
  changeUserPermissionActionSchemaType,
  createAgencyActionSchemaType,
  createPipelineSchemaType,
  createSubaccountActionSchemaType,
  deleteAgencyActionSchemaType,
  deleteMediaActionSchemaType,
  deletePipelineActionSchemaType,
  deleteSubaccountActionSchemaType,
  deleteUserActionSchemaType,
  initUserActionSchemaType,
  sendInvitationSchemaType,
  updateAgencyActionSchemaType,
  updateGoalActionSchemaType,
  updatePipelineActionSchemaType,
  updateSubaccountActionSchemaType,
  updateUserActionSchemaType,
  uploadMediaActionSchemaType,
} from "@/types";
import { validateUser } from "./auth";
import { redirect } from "next/navigation";

export const verifyAndAcceptInvitationAction = async () => {
  const user = await validateUser();

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
    avatarUrl: user.imageUrl,
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
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createAgencyAction = async (
  props: createAgencyActionSchemaType
) => {
  await validateUser();

  const data = ZodValidator(createAgencyActionSchema, props);

  const res = await db.agency.create({
    data: {
      ...data,
      connectAccountId: "",
      customerId: data.customerId,
      users: {
        connect: {
          email: data.companyEmail,
        },
      },
      SidebarOption: {
        create: [
          {
            name: "Dashboard",
            icon: "category",
            link: `/agency/${data.id}`,
          },
          {
            name: "Sub Accounts",
            icon: "person",
            link: `/agency/${data.id}/all-subaccounts`,
          },
          {
            name: "Team",
            icon: "shield",
            link: `/agency/${data.id}/team`,
          },
          {
            name: "Billing",
            icon: "payment",
            link: `/agency/${data.id}/billing`,
          },
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/agency/${data.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/agency/${data.id}/settings`,
          },
        ],
      },
    },
  });

  return res;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateAgencyAction = async (
  props: updateAgencyActionSchemaType
) => {
  const user = await validateUser();

  const data = ZodValidator(updateAgencyActionSchema, props);

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    throw "access denied";

  const agencyId = data.id;
  if (!agencyId) throw "agency id required";

  await db.agency.update({ where: { id: agencyId }, data: data });

  await saveActivityLogsNotification({
    agencyId: agencyId,
    description: "Agency information updated",
    subaccountId: undefined,
  });

  return true;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteAgencyAction = async (
  props: deleteAgencyActionSchemaType
) => {
  const user = await validateUser();

  const data = ZodValidator(deleteAgencyActionSchema, props);

  const { agencyId } = data;
  if (user.privateMetadata.role !== "AGENCY_OWNER") throw "access denied";
  const agency_exist = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
  });
  if (!agency_exist) throw "agency dos not exist";
  if (agency_exist.companyEmail !== user.emailAddresses[0].emailAddress)
    throw "access denied";

  await db.agency.delete({ where: { id: agencyId } });

  return true;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateGoalAction = async (props: updateGoalActionSchemaType) => {
  await validateUser();

  const data = ZodValidator(updateGoalActionSchema, props);

  await db.agency.update({
    where: { id: data.agencyId },
    data: { goal: data.goal },
  });

  await saveActivityLogsNotification({
    agencyId: data.agencyId,
    description: "Agency goal updated",
    subaccountId: undefined,
  });

  return true;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const initUserAction = async (props: initUserActionSchemaType) => {
  const user = await validateUser();

  const user_exist = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  const data = ZodValidator(initUserActionSchema, props);

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: data.role,
    },
  });

  if (user_exist) return user_exist;

  const new_user = await db.user.create({
    data: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatarUrl: user.imageUrl,
      agencyId: data.agencyId,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return new_user;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createSubAccountAction = async (
  props: createSubaccountActionSchemaType
) => {
  const user = await getCurrentUser();
  const userClerk = await validateUser();

  if (!user || userClerk.privateMetadata.role !== "AGENCY_OWNER")
    throw "access deined";

  const data = ZodValidator(createSubaccountActionSchema, props);

  const agencyOwner = await db.user.findFirst({
    where: {
      role: "AGENCY_OWNER",
      agencyId: data.agencyId,
    },
  });

  if (!agencyOwner) throw "access deined";

  const permissionId = v4();

  const res = await db.subAccount.create({
    data: {
      ...data,
      agencyId: data.agencyId,
      id: data.id,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: data.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: [
          {
            name: "Lead Cycle",
          },
        ],
      },
      SidebarOption: {
        create: [
          {
            name: "Dashboard",
            icon: "category",
            link: `/subaccount/${data.id}`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/subaccount/${data.id}/funnels`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/subaccount/${data.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/subaccount/${data.id}/contacts`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/subaccount/${data.id}/media`,
          },
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/subaccount/${data.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/subaccount/${data.id}/settings`,
          },
        ],
      },
    },
  });

  await saveActivityLogsNotification({
    agencyId: data.agencyId,
    description: `Account "${data.name}" created`,
    subaccountId: undefined,
  });

  return res;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateSubAccountAction = async (
  props: updateSubaccountActionSchemaType
) => {
  const user = await validateUser();
  if (
    !user ||
    (user.privateMetadata.role !== "AGENCY_ADMIN" &&
      user.privateMetadata.role !== "AGENCY_OWNER")
  )
    throw "access deined";

  const data = ZodValidator(updateSubaccountActionSchema, props);

  const agencyOwner = await db.user.findFirst({
    where: {
      role: "AGENCY_OWNER",
      agencyId: data.agencyId,
    },
  });

  if (!agencyOwner) throw "access deined";

  const subAccountId = data.id;
  if (!subAccountId) throw "agency id required";

  await db.subAccount.update({ where: { id: subAccountId }, data: data });

  await saveActivityLogsNotification({
    agencyId: data.agencyId,
    description: "Account information updated",
    subaccountId: subAccountId,
  });

  return true;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateUserAction = async (props: updateUserActionSchemaType) => {
  const user = await validateUser();

  const data = ZodValidator(updateUserActionSchema, props);

  const user_exist = await db.user.findUnique({
    where: { email: data.email },
    include: { Permissions: true },
  });

  if (!user_exist || !user_exist.agencyId) throw "user dos not exist";

  const updatedUser = await updateUser(user_exist.id, {
    name: data.name,
    avatarUrl: data.avatarUrl || user.imageUrl,
    email: data.email,
    role: data.role,
  });
  if (!updatedUser) throw "Something went wrong";

  await clerkClient.users.updateUserMetadata(updatedUser.id, {
    privateMetadata: {
      role: data.role,
    },
  });

  await clerkClient.users.updateUser(updatedUser.id, {
    firstName: data.name.split(" ")[0],
    lastName: data.name.split(" ")[1],
  });

  if (!updateUser || !updatedUser.agencyId) throw "Something went wrong";

  const desc = `Updated ${updatedUser?.name} information`;

  if (
    updatedUser.role === "AGENCY_OWNER" ||
    updatedUser.role === "AGENCY_ADMIN"
  ) {
    await saveActivityLogsNotification({
      agencyId: updatedUser.agencyId,
      description: desc,
      subaccountId: undefined,
    });
  }

  if (
    user_exist.Permissions.length &&
    (updatedUser.role === "SUBACCOUNT_USER" ||
      updatedUser.role === "SUBACCOUNT_GUEST")
  ) {
    await Promise.all([
      await saveActivityLogsNotification({
        agencyId: updatedUser.agencyId,
        description: desc,
        subaccountId: undefined,
      }),
      user_exist.Permissions.map(async (per) => {
        if (per.access)
          await saveActivityLogsNotification({
            agencyId: undefined,
            description: desc,
            subaccountId: per.subAccountId,
          });
      }),
    ]);
  }

  return updatedUser;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const changeUserPermissionAction = async (
  props: changeUserPermissionActionSchemaType
) => {
  const user = await validateUser();
  if (user.privateMetadata.role !== "AGENCY_OWNER") throw "access denied";

  const data = ZodValidator(changeUserPermissionActionSchema, props);

  let permission;

  if (!data.permissionId) {
    const res = await db.permissions.create({
      data: {
        access: data.access,
        subAccountId: data.subaccountId,
        email: data.email,
      },
    });
    permission = res;
  } else {
    const res = await db.permissions.upsert({
      where: {
        id: data.permissionId,
      },
      update: {
        access: data.access,
      },
      create: {
        access: data.access,
        subAccountId: data.subaccountId,
        email: data.email,
      },
    });
    permission = res;
  }

  let desc = data.access
    ? `Gave ${data.user_name} access to | ${data.subaccount_name}`
    : `Canceled ${data.user_name}'s access to | ${data.subaccount_name}`;

  await saveActivityLogsNotification({
    description: desc,
    agencyId: data.agenc_id,
    subaccountId: data.subaccountId,
  });

  return permission;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteSubaccountAction = async (
  props: deleteSubaccountActionSchemaType
) => {
  const user = await validateUser();

  if (user.privateMetadata.role !== "AGENCY_OWNER") throw "access denied";

  const data = ZodValidator(deleteSubaccountActionSchema, props);

  const userData = await getCurrentUserData();
  if (!userData) throw "access denied";
  const subaccount_exist = await getSubAccount(data.subaccountId);

  if (!subaccount_exist) throw "subaccount dos not exist";
  if (subaccount_exist.agencyId !== userData.agencyId) throw "access denied";

  const res = await db.subAccount.delete({
    where: {
      id: data.subaccountId,
    },
  });

  if (!res) return;

  await saveActivityLogsNotification({
    agencyId: userData.agencyId,
    description: `Delete a Subaccount | ${res.name}`,
    subaccountId: undefined,
  });

  return res;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteUserAction = async (props: deleteUserActionSchemaType) => {
  const user = await validateUser();

  const data = ZodValidator(deleteUserActionSchema, props);

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    throw "access denied";

  const user_exist = await db.user.findUnique({
    where: { id: data.userId },
  });

  if (!user_exist) throw "user dos not exist";

  const deleted_user = await db.user.delete({
    where: {
      id: data.userId,
    },
  });

  await saveActivityLogsNotification({
    description: `Delete a user | ${deleted_user.name}`,
    agencyId: deleted_user.agencyId!,
    subaccountId: undefined,
  });

  return deleted_user;
};

("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const sendInvitationAction = async (props: sendInvitationSchemaType) => {
  const user = await validateUser();

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    throw "access deined";

  const data = ZodValidator(sendInvitationSchema, props);

  const userData = await getCurrentUserData();

  if (!userData || !userData.agencyId) throw "access deined";

  const agency = await getAgency(userData?.agencyId);

  const res = await createInvitation({
    email: data.email,
    role: data.role,
    agencyId: userData.agencyId,
    status: "PENDING",
  });

  if (!res) throw "Something went wrong";

  const { error, message } = await emailSender({
    email: data.email,
    subject: `Invitationg You`,
    body: invitationTemplate({
      company_name: agency?.name || "",
      inviter_name: userData.name,
      redirect_url: `${env.NEXT_PUBLIC_URL}agency`,
    }),
  });

  if (error) throw `${message}`;

  await saveActivityLogsNotification({
    description: `Invite ${data.email}`,
    agencyId: userData.agencyId,
    subaccountId: undefined,
  });

  return true;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createMediaAction = async (props: uploadMediaActionSchemaType) => {
  await validateUser();

  const data = ZodValidator(uploadMediaActionSchema, props);

  const subaccount_exist = await getSubAccount(data.subaccountId);
  if (!subaccount_exist) throw "there is no subaccount with this id";
  const media = await db.media.create({
    data: {
      name: data.name,
      link: data.link,
      subAccountId: data.subaccountId,
    },
  });

  await saveActivityLogsNotification({
    subaccountId: subaccount_exist.id,
    agencyId: undefined,
    description: `Uploaded a media file | ${media.name}`,
  });

  return media;
};

("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteMediaAction = async (props: deleteMediaActionSchemaType) => {
  await getCurrentUser();
  const data = ZodValidator(deleteMediaActionSchema, props);
  const media_exist = await getMedia(data.id);
  if (!media_exist) throw "there is no media with this id";
  const media = await db.media.delete({
    where: {
      id: data.id,
    },
  });

  await saveActivityLogsNotification({
    subaccountId: media_exist.subAccountId,
    agencyId: undefined,
    description: `A Media deleted | ${media.name}`,
  });

  return media;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createPipelineAction = async (props: createPipelineSchemaType) => {
  const userData = await getCurrentUserData();
  if (!userData) return redirect("/sign-in");

  const data = ZodValidator(createPipelineSchema, props);

  const res = await createPipeline({
    name: data.name,
    subAccountId: data.subaccountId,
  });
  if (!res) return null;

  await saveActivityLogsNotification({
    agencyId: userData?.agencyId || undefined,
    description: `New Pipeline Created | ${res.name}`,
    subaccountId: data.subaccountId,
  });

  return res;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updatePipelineAction = async (
  props: updatePipelineActionSchemaType
) => {
  const userData = await getCurrentUserData();
  if (!userData) return redirect("/sign-in");

  const data = ZodValidator(updatePipelineActionSchema, props);

  const res = await updatePipeline({
    name: data.name,
    subAccountId: data.subaccountId,
    id: data.id,
  });
  if (!res) return null;

  await saveActivityLogsNotification({
    agencyId: userData?.agencyId || undefined,
    description: `Pipeline details updated | ${res.name}`,
    subaccountId: data.subaccountId,
  });

  return res;
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deletePipelineAction = async (
  props: deletePipelineActionSchemaType
) => {
  await validateUser();

  const data = ZodValidator(deletePipelineActionSchema, props);

  const userData = await getCurrentUserData();

  const res = await deletePipeline(data.pipelineId);

  if (!res) return null;

  await saveActivityLogsNotification({
    agencyId: userData?.agencyId || undefined,
    description: `A Pipeline Deleted | ${res.name}`,
    subaccountId: data.subaccountId,
  });

  return res;
};
("------------------------------------------------------------------------------------------");
