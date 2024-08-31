"use server";

import { db } from "@/lib/db";
import {
  createAccount,
  createInvitation,
  createTeamUser,
  createUser,
  createVerifyOtp,
  deleteVerifyOtp,
  findUserByEmail,
  getAccountByUserId,
  getUserAndAccountByEmail,
  getUserByEmail,
  getUserById,
  getVerifyOtpByUserId,
  updateAccount,
  updateManyUserByAgencyId,
  updateUser,
} from "./user";
import {
  getMedia,
  rateLimitter,
  saveActivityLogsNotification,
} from "./global-use-case";
import {
  changeUserPermissionActionSchema,
  contactFormSchema,
  createAgencyActionSchema,
  createContactFormSchema,
  createCopyFunnelPageFormSchema,
  createLineFormSchema,
  createPipelineSchema,
  createSubaccountActionSchema,
  createTagSchema,
  deleteAgencyActionSchema,
  deleteContactFormSchema,
  deleteFunnelActionSchema,
  deleteFunnelPageFormSchema,
  deleteLaneActionSchema,
  deleteMediaActionSchema,
  deletePipelineActionSchema,
  deleteSubaccountActionSchema,
  deleteTagSchema,
  deleteTicketSchema,
  forgotPasswordFormSchema,
  funnelFormSchema,
  funnelPageFormSchema,
  removeUserAccessToAgencyActionSchema,
  resetPasswordFormSchema,
  sendInvitationSchema,
  signInFormSchema,
  signUpFormSchema,
  ticketFormSchema,
  updateAgencyActionSchema,
  updateContactFormSchema,
  updateFunnelFormSchema,
  updateFunnelPageFormSchema,
  updateGoalActionSchema,
  updateLineFormSchema,
  updatePipelineActionSchema,
  updateSubaccountActionSchema,
  updateTicketSchema,
  updateUserActionSchema,
  uploadMediaActionSchema,
  verifyEmailFormSchema,
} from "@/zod";
import { v4 } from "uuid";
import { getSubAccount } from "./subaccount";
import { emailSender } from "@/lib/email";
import invitationTemplate from "@/emails/invitation";
import { getAgency } from "./agency";
import { createPipeline, deletePipeline, updatePipeline } from "./pipeline";
import {
  compareHashes,
  createJwtToken,
  generateRandomSixDigitNumber,
  hashPassword,
  verifyJwtToken,
  ZodValidator,
} from "@/lib/use-case";
import {
  changeUserPermissionActionSchemaType,
  createAgencyActionSchemaType,
  createContactFormSchemaType,
  createCopyFunnelPageFormSchemaType,
  createLineFormSchemaType,
  createPipelineSchemaType,
  createSubaccountActionSchemaType,
  createTagSchemaType,
  createTicketSchemaType,
  deleteAgencyActionSchemaType,
  deleteContactFormSchemaType,
  deleteFunnelActionSchemaType,
  deleteFunnelPageFormSchemaType,
  deleteLaneActionSchemaType,
  deleteMediaActionSchemaType,
  deletePipelineActionSchemaType,
  deleteSubaccountActionSchemaType,
  deleteTagSchemaType,
  deleteTicketSchemaType,
  forgotPasswordFormSchemaType,
  funnelFormSchemaType,
  funnelPageFormSchemaType,
  removeUserAccessToAgencyActionSchemaType,
  resetPasswordFormSchemaType,
  sendInvitationSchemaType,
  signInFormSchemaType,
  signUpFormSchemaType,
  updateAgencyActionSchemaType,
  updateContactFormSchemaType,
  updateFunnelFormSchemaType,
  updateFunnelPageFormSchemaType,
  updateGoalActionSchemaType,
  updateLineFormSchemaType,
  updatePipelineActionSchemaType,
  updateSubaccountActionSchemaType,
  updateTicketSchemaType,
  updateUserActionSchemaType,
  uploadMediaActionSchemaType,
  verifyEmailFormSchemaType,
} from "@/types";
import { validateUser } from "./auth";
import {
  AccesssibilityError,
  EmailInUseError,
  LoginError,
  PublicError,
  returnError,
  VerifyCodeExpiredError,
} from "@/lib/errors";
import verifyEmailTemplate from "@/emails/verifayEmail";
import { User } from "@prisma/client";
import { setSession } from "@/lib/session";
import resetPasswordTemplate from "@/emails/resetPassword";
import { getFunnel, getFunnelPage } from "./funnel";

("------------------------------------------------------------------------------------------");
export async function registerUserAction(props: signUpFormSchemaType) {
  try {
    const data = ZodValidator(signUpFormSchema, props);

    await rateLimitter({ limit: 3, duration: 45 });

    const existingUser = await getUserAndAccountByEmail(data.email);

    let user: User | null = null;

    if (existingUser) {
      if (existingUser.Account?.emailVerified) throw new EmailInUseError();
      user = await updateUser(existingUser.id, {
        name: data.name,
      });
    } else {
      user = await createUser(data);
      if (!user) throw new PublicError();
    }

    if (!user) throw new PublicError();

    const otp = generateRandomSixDigitNumber().toString();

    const verifyOtpData = await createVerifyOtp(user.id, otp);
    if (!verifyOtpData) throw new PublicError();

    const acc = await createAccount({
      userId: user.id,
      type: "PASSWORD",
      password: data.password,
    });
    if (!acc) throw new PublicError();

    const { error } = await emailSender({
      subject: "Verify your email",
      body: verifyEmailTemplate({ code: otp }),
      email: user.email,
    });

    if (error)
      throw new PublicError("Our email sender fk up, please try again");

    return { id: user.id };
  } catch (err) {
    return returnError(err as Error);
  }
}
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export async function verifyEmailAction(props: verifyEmailFormSchemaType) {
  try {
    const data = ZodValidator(verifyEmailFormSchema, props);

    const verifiy_otp_data = await getVerifyOtpByUserId(data.userId);

    if (!verifiy_otp_data) throw new PublicError("Please sign up again");

    const isEqual = await compareHashes(data.otp, verifiy_otp_data.otp);

    if (!Boolean(isEqual)) throw new PublicError("Entered code is incorrect");

    if (new Date(verifiy_otp_data.expireAt) < new Date(Date.now()))
      throw new VerifyCodeExpiredError();

    const account = await getAccountByUserId(verifiy_otp_data.userId);

    if (!account) throw new PublicError();

    await updateAccount(account.id, {
      emailVerified: true,
    });

    await deleteVerifyOtp(verifiy_otp_data.id);

    return verifiy_otp_data.userId;
  } catch (err) {
    return returnError(err as Error);
  }
}
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const signInUserAction = async (props: signInFormSchemaType) => {
  try {
    const data = ZodValidator(signInFormSchema, props);

    const user = await getUserByEmail(data.email);

    if (!user) throw new LoginError();

    const account = await getAccountByUserId(user.id);
    if (!account) throw new PublicError();

    if (account.type === "GOOGLE")
      throw new PublicError(
        "This email used to sign in with google, try another email or sign in with google"
      );

    if (!account.password) throw new PublicError();

    const result = await compareHashes(data.password, account.password);

    if (!result) throw new LoginError();

    await setSession(user.id);

    return user.id;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const forgotPasswordUserAction = async (
  props: forgotPasswordFormSchemaType
) => {
  try {
    const data = ZodValidator(forgotPasswordFormSchema, props);

    const user = await getUserByEmail(data.email);

    if (!user) throw new PublicError("There is no user with this email");

    const token = await createJwtToken({
      data: {
        user_id: user.id,
      },
      expireAt: 5 * 60,
    });

    if (!token) throw new PublicError();

    const link = `${process.env.NEXT_PUBLIC_URL}agency/forgot-password?token=${token}`;

    const { error, message } = await emailSender({
      email: data.email,
      subject: `Invitation`,
      body: resetPasswordTemplate({
        link,
      }),
    });

    if (error)
      throw new PublicError("Sorry our email sender fk up, please try again.");

    return user.id;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const resetPasswordUserAction = async (
  props: resetPasswordFormSchemaType
) => {
  try {
    const data = ZodValidator(resetPasswordFormSchema, props);

    const verified_token = (await verifyJwtToken(data.token)) as {
      user_id: string;
    };

    if (!verified_token) throw new PublicError("Link expired or invalid");

    const { user_id } = verified_token;
    if (!user_id) throw new PublicError("Link expired or invalid");

    const user_exist = await getUserById(user_id);

    if (!user_exist) throw new PublicError("User not found");

    const account = await getAccountByUserId(user_id);
    if (!account) throw new PublicError();

    const hashedPassword = await hashPassword(data.password, 10);

    await updateAccount(account.id, {
      password: hashedPassword,
    });

    return user_id;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const verifyAndAcceptInvitationAction = async () => {
  try {
    const user = await validateUser();

    const invitation_exist = await db.invitation.findUnique({
      where: { email: user.email, status: "PENDING" },
    });

    if (!invitation_exist) {
      const res = await findUserByEmail(user.email);

      return res?.agencyId || null;
    }

    if (user.role === "AGENCY_OWNER")
      throw new PublicError("User already own an agency");
    if (user.agencyId) throw new PublicError("User already part of an agency");

    const team_user = await createTeamUser({
      userId: user.id,
      agencyId: invitation_exist.agencyId,
      role: invitation_exist.role,
    });

    if (!team_user) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: invitation_exist.agencyId,
      description: "Joined",
      subaccountId: undefined,
    });

    await db.invitation.delete({ where: { email: team_user.email } });

    return team_user.agencyId;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createAgencyAction = async (
  props: createAgencyActionSchemaType
) => {
  try {
    const user = await validateUser();
    if (user.agencyId || user.role)
      throw new PublicError("User already part of an agency");

    const data = ZodValidator(createAgencyActionSchema, props);
    const agency_exsit = await db.agency.findUnique({
      where: {
        companyEmail: user.email,
      },
    });

    if (agency_exsit) throw new PublicError("User already own an agency");

    const res = await db.agency.create({
      data: {
        id: data.id,
        name: data.name,
        companyEmail: data.companyEmail,
        companyPhone: data.companyPhone,
        agencyLogo: data.agencyLogo,
        address: data.address,
        city: data.city,
        country: data.country,
        state: data.state,
        zipCode: data.zipCode,
        goal: data.goal,
        whiteLabel: data.whiteLabel,
        connectAccountId: "",
        customerId: data.customerId,
        ownerId: user.id,
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

    await updateUser(user.id, {
      agencyId: res.id,
      role: data.user_role,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateAgencyAction = async (
  props: updateAgencyActionSchemaType
) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(updateAgencyActionSchema, props);

    if (user.role !== "AGENCY_OWNER") throw new AccesssibilityError();

    if (!user.agencyId || user.agencyId !== data.id)
      throw new AccesssibilityError();

    const agencyId = data.id;
    if (!agencyId) throw new PublicError("agency id required");

    await db.agency.update({ where: { id: agencyId }, data: data });

    await saveActivityLogsNotification({
      agencyId: agencyId,
      description: "Agency information updated",
      subaccountId: undefined,
    });

    return true;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteAgencyAction = async (
  props: deleteAgencyActionSchemaType
) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(deleteAgencyActionSchema, props);

    if (!user.agencyId || user.agencyId !== data.agencyId)
      throw new AccesssibilityError();

    const { agencyId } = data;
    if (user.role !== "AGENCY_OWNER") throw new AccesssibilityError();

    const agency_exist = await db.agency.findUnique({
      where: {
        id: agencyId,
      },
    });

    if (!agency_exist) throw new PublicError("agency dos not exist");

    if (agency_exist.companyEmail !== user.email)
      throw new AccesssibilityError();

    await db.agency.delete({ where: { id: agencyId } });

    await updateManyUserByAgencyId(agencyId, { role: null, agencyId: null });

    return true;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateGoalAction = async (props: updateGoalActionSchemaType) => {
  try {
    const user = await validateUser();
    const data = ZodValidator(updateGoalActionSchema, props);

    if (user.role !== "AGENCY_OWNER" && user.role !== "AGENCY_ADMIN")
      throw new AccesssibilityError();

    if (user.agencyId !== data.agencyId) throw new AccesssibilityError();

    if (!user.agencyId || user.agencyId !== data.agencyId)
      throw new AccesssibilityError();

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
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createSubAccountAction = async (
  props: createSubaccountActionSchemaType
) => {
  try {
    const user = await validateUser();

    if (!user || user.role !== "AGENCY_OWNER") throw new AccesssibilityError();

    const data = ZodValidator(createSubaccountActionSchema, props);

    const permissionId = v4();

    const res = await db.subAccount.create({
      data: {
        ...data,
        agencyId: data.agencyId,
        id: data.id,
        Permissions: {
          create: {
            access: true,
            email: user.email,
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
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateSubAccountAction = async (
  props: updateSubaccountActionSchemaType
) => {
  try {
    const user = await validateUser();

    if (
      !user ||
      (user.role !== "AGENCY_ADMIN" &&
        user.role !== "AGENCY_OWNER" &&
        user.role !== "SUBACCOUNT_ADMIN")
    )
      throw new AccesssibilityError();

    const data = ZodValidator(updateSubaccountActionSchema, props);

    const subAccountId = data.id;
    if (!subAccountId) throw new PublicError("Subaccout id required");

    await db.subAccount.update({ where: { id: subAccountId }, data: data });

    await saveActivityLogsNotification({
      agencyId: data.agencyId,
      description: "Account information updated",
      subaccountId: subAccountId,
    });

    return true;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateUserAction = async (props: updateUserActionSchemaType) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(updateUserActionSchema, props);

    const user_exist = await db.user.findUnique({
      where: { email: data.email },
      include: { Permissions: true },
    });

    if (!user_exist || !user_exist.agencyId)
      throw new PublicError("user dos not exist");

    if (user_exist.role === "AGENCY_OWNER" && user_exist.email !== user.email)
      throw new AccesssibilityError();
    if (user_exist.role === "AGENCY_OWNER" && data.role !== "AGENCY_OWNER")
      throw new AccesssibilityError();

    if (
      user_exist.role === "AGENCY_ADMIN" &&
      user.role !== "AGENCY_OWNER" &&
      user.role !== "AGENCY_ADMIN"
    )
      throw new AccesssibilityError();

    if (
      user_exist.role === "AGENCY_ADMIN" &&
      user.role === "AGENCY_ADMIN" &&
      user_exist.id !== user.id
    )
      throw new AccesssibilityError();

    if (
      user_exist.role === "SUBACCOUNT_ADMIN" &&
      user.role !== "AGENCY_OWNER" &&
      user.role !== "AGENCY_ADMIN" &&
      user.role !== "SUBACCOUNT_ADMIN"
    )
      throw new AccesssibilityError();

    if (
      user_exist.role === "SUBACCOUNT_ADMIN" &&
      user.role === "SUBACCOUNT_ADMIN" &&
      user_exist.id !== user.id
    )
      throw new AccesssibilityError();

    const updatedUser = await updateUser(user_exist.id, {
      name: data.name,
      email: data.email,
      role: data.role,
      avatarUrl: data.avatarUrl || user_exist.avatarUrl,
    });

    if (!updatedUser) throw new PublicError();

    if (!updateUser || !updatedUser.agencyId) throw new PublicError();

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
        updatedUser.role === "SUBACCOUNT_ADMIN" ||
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
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const changeUserPermissionAction = async (
  props: changeUserPermissionActionSchemaType
) => {
  try {
    const user = await validateUser();
    if (user.role !== "AGENCY_OWNER") throw new AccesssibilityError();

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
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteSubaccountAction = async (
  props: deleteSubaccountActionSchemaType
) => {
  try {
    const user = await validateUser();

    if (user.role !== "AGENCY_OWNER") throw new AccesssibilityError();

    const data = ZodValidator(deleteSubaccountActionSchema, props);

    if (!user) throw new AccesssibilityError();
    const subaccount_exist = await getSubAccount(data.subaccountId);

    if (!subaccount_exist) throw new PublicError("subaccount dos not exist");
    if (subaccount_exist.agencyId !== user.agencyId)
      throw new AccesssibilityError();

    const res = await db.subAccount.delete({
      where: {
        id: data.subaccountId,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: user.agencyId,
      description: `Delete a Subaccount | ${res.name}`,
      subaccountId: undefined,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const removeUserAccessToAgencyAction = async (
  props: removeUserAccessToAgencyActionSchemaType
) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(removeUserAccessToAgencyActionSchema, props);

    if (user.role !== "AGENCY_OWNER") throw new AccesssibilityError();

    const user_exist = await db.user.findUnique({
      where: { id: data.userId },
    });

    if (!user_exist) throw new PublicError("user dos not exist");

    if (user_exist.id === user.id) throw new AccesssibilityError();

    if (user_exist.role === "AGENCY_OWNER") throw new AccesssibilityError();

    const removed_user = await updateUser(user_exist.id, {
      agencyId: null,
      role: null,
    });

    if (!removed_user) throw new PublicError();

    await saveActivityLogsNotification({
      description: `Delete a user | ${removed_user.name}`,
      agencyId: removed_user.agencyId!,
      subaccountId: undefined,
    });

    return removed_user;
  } catch (err) {
    return returnError(err as Error);
  }
};

("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const sendInvitationAction = async (props: sendInvitationSchemaType) => {
  try {
    const user = await validateUser();

    if (user.role !== "AGENCY_OWNER" && user.role !== "AGENCY_ADMIN")
      throw new AccesssibilityError();

    const data = ZodValidator(sendInvitationSchema, props);

    if (!user || !user.agencyId) throw new AccesssibilityError();

    const agency = await getAgency(user?.agencyId);

    const res = await createInvitation({
      email: data.email,
      role: data.role,
      agencyId: user.agencyId,
      status: "PENDING",
    });

    if (!res) throw new PublicError();

    const { error, message } = await emailSender({
      email: data.email,
      subject: `Invitation`,
      body: invitationTemplate({
        company_name: agency?.name || "",
        inviter_name: user.name,
        redirect_url: `${process.env.NEXT_PUBLIC_URL}agency`,
      }),
    });

    if (error) throw new PublicError(message);

    await saveActivityLogsNotification({
      description: `Invite ${data.email}`,
      agencyId: user.agencyId,
      subaccountId: undefined,
    });

    return true;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createMediaAction = async (props: uploadMediaActionSchemaType) => {
  try {
    await validateUser();

    const data = ZodValidator(uploadMediaActionSchema, props);

    const subaccount_exist = await getSubAccount(data.subaccountId);
    if (!subaccount_exist)
      throw new PublicError("there is no subaccount with this id");

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
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteMediaAction = async (props: deleteMediaActionSchemaType) => {
  try {
    await validateUser();

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
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createPipelineAction = async (props: createPipelineSchemaType) => {
  try {
    const user = await validateUser();
    if (
      user.role !== "AGENCY_OWNER" &&
      user.role !== "AGENCY_ADMIN" &&
      user.role !== "SUBACCOUNT_ADMIN"
    )
      throw new AccesssibilityError();

    const data = ZodValidator(createPipelineSchema, props);

    const res = await createPipeline({
      name: data.name,
      subAccountId: data.subaccountId,
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `New Pipeline Created | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updatePipelineAction = async (
  props: updatePipelineActionSchemaType
) => {
  try {
    const user = await validateUser();
    if (
      user.role !== "AGENCY_OWNER" &&
      user.role !== "AGENCY_ADMIN" &&
      user.role !== "SUBACCOUNT_ADMIN"
    )
      throw new AccesssibilityError();

    const data = ZodValidator(updatePipelineActionSchema, props);

    const res = await updatePipeline({
      name: data.name,
      subAccountId: data.subaccountId,
      id: data.id,
    });
    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Pipeline details updated | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deletePipelineAction = async (
  props: deletePipelineActionSchemaType
) => {
  try {
    const user = await validateUser();

    if (
      user.role !== "AGENCY_OWNER" &&
      user.role !== "AGENCY_ADMIN" &&
      user.role !== "SUBACCOUNT_ADMIN"
    )
      throw new AccesssibilityError();

    const data = ZodValidator(deletePipelineActionSchema, props);

    const res = await deletePipeline(data.pipelineId);

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `A Pipeline Deleted | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createLaneAction = async (props: createLineFormSchemaType) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(createLineFormSchema, props);

    const last_lane = await db.lane.findFirst({
      orderBy: {
        order: "desc",
      },
    });

    const res = await db.lane.create({
      data: {
        name: data.name,
        pipelineId: data.pipelineId,
        ...(last_lane && { order: last_lane.order + 1 }),
      },
      include: {
        Tickets: {
          orderBy: {
            order: "asc",
          },
          include: {
            Tags: true,
            Assigned: true,
            Customer: true,
          },
        },
      },
    });

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `New lane created | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateLaneAction = async (props: updateLineFormSchemaType) => {
  try {
    await validateUser();

    const data = ZodValidator(updateLineFormSchema, props);

    const res = await db.lane.update({
      where: {
        id: data.laneId,
      },
      data: {
        name: data.name,
      },
    });

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Lane details updated | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteLaneAction = async (props: deleteLaneActionSchemaType) => {
  try {
    await validateUser();

    const data = ZodValidator(deleteLaneActionSchema, props);

    const lane_exist = await db.lane.findFirst({
      where: {
        id: data.laneId,
      },
    });

    if (!lane_exist) throw new PublicError("Lane dos not exist");

    const res = await db.lane.delete({
      where: {
        id: data.laneId,
      },
    });

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Lane deleted | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createTicketAction = async (props: createTicketSchemaType) => {
  try {
    await validateUser();

    const data = ZodValidator(ticketFormSchema, props.data);

    const last_lane_ticket = await db.ticket.findFirst({
      where: {
        laneId: data.laneId,
      },
      orderBy: {
        order: "desc",
      },
    });

    const res = await db.ticket.create({
      data: {
        name: data.name,
        description: data.description,
        value: data.value,
        order: last_lane_ticket?.id ? last_lane_ticket?.order + 1 : 0,
        laneId: data.laneId,
        customerId: data.customerId || "",
        assignedUserId: data.assignedUserId || "",
        Tags: {
          connect: props.tags,
        },
      },
      include: {
        Assigned: true,
        Customer: true,
        Tags: true,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `New ticket created | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateTicketAction = async (props: updateTicketSchemaType) => {
  try {
    await validateUser();

    const data = ZodValidator(updateTicketSchema, props.data);

    const res = await db.ticket.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        value: data.value,
        laneId: data.laneId,
        customerId: data.customerId || "",
        assignedUserId: data.assignedUserId || "",
        Tags: {
          set: props.tags,
        },
      },
      include: {
        Assigned: true,
        Customer: true,
        Tags: true,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Ticket updated | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createTagAction = async (props: createTagSchemaType) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(createTagSchema, props);

    const res = await db.tag.create({
      data: {
        name: data.name,
        color: data.color,
        subAccountId: data.subaccountId,
      },
    });

    if (!res) throw new PublicError();

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteTagAction = async (props: deleteTagSchemaType) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(deleteTagSchema, props);

    const res = await db.tag.delete({
      where: {
        id: data.id,
      },
    });

    if (!res) throw new PublicError();

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteTicketAction = async (props: deleteTicketSchemaType) => {
  try {
    await validateUser();

    const data = ZodValidator(deleteTicketSchema, props);

    const res = await db.ticket.delete({
      where: {
        id: data.id,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Ticket updated | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createContactAction = async (
  props: createContactFormSchemaType
) => {
  try {
    await validateUser();

    const data = ZodValidator(createContactFormSchema, props);

    const contact_exist = await db.contact.findUnique({
      where: {
        email: data.email,
      },
    });

    if (contact_exist) throw new PublicError("Contact with this email exist");

    const res = await db.contact.create({
      data: {
        name: data.name,
        email: data.email,
        subAccountId: data.subaccountId,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `New contact created | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateContactAction = async (
  props: updateContactFormSchemaType
) => {
  try {
    await validateUser();

    const data = ZodValidator(updateContactFormSchema, props);

    const contact_exist = await db.contact.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!contact_exist)
      throw new PublicError("Contact with this id dos not exist");

    const res = await db.contact.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Contact information updated | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteContactAction = async (
  props: deleteContactFormSchemaType
) => {
  try {
    await validateUser();

    const data = ZodValidator(deleteContactFormSchema, props);

    const res = await db.contact.delete({
      where: {
        id: data.id,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `A Contact Deleted | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createFunnelAction = async (props: funnelFormSchemaType) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(funnelFormSchema, props);

    if (user.role === "SUBACCOUNT_GUEST" || user.role === "SUBACCOUNT_USER")
      throw new AccesssibilityError();

    const res = await db.funnel.create({
      data: {
        name: data.name,
        description: data.description,
        subAccountId: data.subaccountId,
        subDomainName: data.subDomainName,
        favicon: data.favicon,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `New funnel created | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateFunnelAction = async (props: updateFunnelFormSchemaType) => {
  try {
    const user = await validateUser();

    const data = ZodValidator(updateFunnelFormSchema, props);

    if (user.role === "SUBACCOUNT_GUEST" || user.role === "SUBACCOUNT_USER")
      throw new AccesssibilityError();

    const funnel_exist = await getFunnel(data.id);
    if (!funnel_exist) throw new PublicError("Funnel dos not exist");

    const res = await db.funnel.update({
      where: { id: funnel_exist.id },
      data: {
        name: data.name,
        description: data.description,
        subAccountId: data.subaccountId,
        subDomainName: data.subDomainName,
        favicon: data.favicon,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Funnel details updated | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteFunnelAction = async (
  props: deleteFunnelActionSchemaType
) => {
  try {
    const user = await validateUser();
    if (user.role === "SUBACCOUNT_USER" || user.role === "SUBACCOUNT_GUEST")
      throw new AccesssibilityError();

    const data = ZodValidator(deleteFunnelActionSchema, props);

    const res = await db.funnel.delete({
      where: {
        id: data.funnelId,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `A Pipeline Deleted | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createFunnelPageAction = async (
  props: funnelPageFormSchemaType
) => {
  try {
    await validateUser();

    const data = ZodValidator(funnelPageFormSchema, props);

    const last_page = await db.funnelPage.findFirst({
      where: {
        funnelId: data.funnelId,
      },
      orderBy: {
        order: "desc",
      },
    });

    if (last_page && !data.pathName)
      throw new PublicError(
        "Pages other than the first page in the funnel require a path name example 'secondstep'."
      );

    const res = await db.funnelPage.create({
      data: {
        name: data.name,
        pathName: data.pathName || "",
        funnelId: data.funnelId,
        order: last_page ? last_page.order + 1 : 0,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `New funnel page created | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const updateFunnelPageAction = async (
  props: updateFunnelPageFormSchemaType
) => {
  try {
    await validateUser();

    const data = ZodValidator(updateFunnelPageFormSchema, props);

    const page_exist = await getFunnelPage(data.id);
    if (!page_exist) throw new PublicError("Funnel page dos not exist");

    const res = await db.funnelPage.update({
      where: { id: page_exist.id },
      data: {
        name: data.name,
        order: data.order,
        pathName: data.pathName || page_exist.pathName,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Funnel page details updated | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const createCopyFunnelPageAction = async (
  props: createCopyFunnelPageFormSchemaType
) => {
  try {
    await validateUser();

    const data = ZodValidator(createCopyFunnelPageFormSchema, props);

    const original_page_exist = await getFunnelPage(data.page_id);
    if (!original_page_exist)
      throw new PublicError("Funnel page dos not exist");

    const last_page = await db.funnelPage.findFirst({
      where: {
        funnelId: original_page_exist.funnelId,
      },
      orderBy: {
        order: "desc",
      },
    });

    if (!last_page) throw new PublicError();

    const res = await db.funnelPage.create({
      data: {
        name: original_page_exist.name,
        pathName: original_page_exist.pathName || "new-page",
        funnelId: original_page_exist.funnelId,
        order: last_page ? last_page.order + 1 : original_page_exist.order + 1,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `New funnel page created | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");

("------------------------------------------------------------------------------------------");
export const deleteFunnelPageAction = async (
  props: deleteFunnelPageFormSchemaType
) => {
  try {
    await validateUser();

    const data = ZodValidator(deleteFunnelPageFormSchema, props);

    const res = await db.funnelPage.delete({
      where: {
        id: data.funnelPageId,
      },
    });

    if (!res) throw new PublicError();

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `A Funnel Page Deleted | ${res.name}`,
      subaccountId: data.subaccountId,
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
("------------------------------------------------------------------------------------------");
