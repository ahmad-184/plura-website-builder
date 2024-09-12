import { z } from "zod";

export const signUpFormSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "password must have more than 8 characteres" }),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const verifyEmailFormSchema = z.object({
  otp: z.string().max(6),
  userId: z.string(),
});

export const signInFormSchema = z.object({
  email: z.string().email().min(1),
  password: z
    .string()
    .min(8, { message: "password must have more than 8 characteres" }),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email().min(1),
});

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "password must have more than 8 characteres" }),
    passwordConfirmation: z.string().min(8),
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export const agencyDetailFormSchema = z.object({
  agencyLogo: z.string().min(1),
  companyEmail: z.string().email().min(1),
  companyPhone: z.string().min(8),
  whiteLabel: z.boolean().default(false),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  goal: z.number().optional().default(1),
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars" }),
});

export const subAccountDetailFormSchema = z.object({
  subAccountLogo: z.string().min(1),
  companyEmail: z.string().email().min(1),
  companyPhone: z.string().min(8),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars" }),
});

export const userDetailsFormSchema = z.object({
  name: z.string().min(1),
  avatarUrl: z.string().optional().nullable(),
  email: z.string().email().min(1),
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

export const sendInvitationSchema = z.object({
  email: z.string().email().min(1),
  role: z.enum([
    "AGENCY_ADMIN",
    "SUBACCOUNT_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

export const uploadMediaFormSchema = z.object({
  name: z.string().min(1),
  link: z.string().min(1),
  subaccountId: z.string().min(1),
});

export const createPipelineSchema = z.object({
  name: z.string().min(1),
  subaccountId: z.string().min(1),
});

export const deletePipelineActionSchema = z.object({
  subaccountId: z.string().min(1),
  pipelineId: z.string().min(1),
});

export const createAgencyActionSchema = agencyDetailFormSchema.and(
  z.object({
    customerId: z.string(),
    id: z.string(),
    user_role: z.enum(["AGENCY_OWNER"]),
  })
);

export const updateAgencyActionSchema = agencyDetailFormSchema.and(
  z.object({
    id: z.string(),
  })
);

export const updateGoalActionSchema = z.object({
  goal: z.number().min(1, { message: "agency id required" }),
  agencyId: z.string().min(1, { message: "agency id required" }),
});

export const deleteSubaccountActionSchema = z.object({
  subaccountId: z.string(),
});

export const removeUserAccessToAgencyActionSchema = z.object({
  userId: z.string(),
});

export const deleteAgencyActionSchema = z.object({
  agencyId: z.string().min(1, { message: "agency id required" }),
});

export const updatePipelineActionSchema = createPipelineSchema.and(
  z.object({ id: z.string() })
);

export const deleteMediaActionSchema = z.object({
  id: z.string(),
});

export const createSubaccountActionSchema = subAccountDetailFormSchema.and(
  z.object({ id: z.string(), agencyId: z.string() })
);

export const updateSubaccountActionSchema = subAccountDetailFormSchema.and(
  z.object({
    id: z.string(),
    agencyId: z.string(),
  })
);

export const uploadMediaActionSchema = uploadMediaFormSchema;

export const updateUserActionSchema = z.object({
  name: z.string().min(1),
  avatarUrl: z.string().optional().nullable(),
  email: z.string().email(),
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

export const changeUserPermissionActionSchema = z.object({
  email: z.string().email(),
  subaccountId: z.string().min(1),
  access: z.boolean(),
  permissionId: z.string().optional(),
  user_name: z.string(),
  subaccount_name: z.string(),
  agenc_id: z.string(),
});

export const initUserActionSchema = z.object({
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
  agencyId: z.string(),
});

export const createLineFormSchema = z.object({
  name: z.string().min(1),
  pipelineId: z.string().min(1),
  subaccountId: z.string().min(1),
});

export const updateLineFormSchema = z.object({
  laneId: z.string().min(1),
  name: z.string().min(1),
  subaccountId: z.string().min(1),
});

export const deleteLaneActionSchema = z.object({
  laneId: z.string().min(1),
  subaccountId: z.string().min(1),
});

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;
export const ticketFormSchema = z.object({
  laneId: z.string().min(1),
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  value: z
    .string()
    .refine((value) => currencyNumberRegex.test(value), {
      message: "Value must be a valid price.",
    })
    .nullable(),
  customerId: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
});

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  subAccountId: z.string(),
});

export const tagsSchema = z.array(tagSchema);

export const updateTicketSchema = z.object({
  id: z.string().min(1),
  laneId: z.string().min(1),
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  value: z
    .string()
    .refine((value) => currencyNumberRegex.test(value), {
      message: "Value must be a valid price.",
    })
    .nullable(),
  customerId: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
});

export const createTagSchema = z.object({
  name: z.string().min(1),
  subaccountId: z.string().min(1),
  color: z.enum(["BLUE", "ORANGE", "ROSE", "PURPLE", "GREEN"]),
});

export const deleteTagSchema = z.object({
  id: z.string().min(1),
});

export const deleteTicketSchema = z.object({
  id: z.string().min(1),
  subaccountId: z.string().min(1),
});

export const contactFormSchema = z.object({
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().min(1),
});

export const createContactFormSchema = z.object({
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().min(1),
});

export const updateContactFormSchema = z.object({
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().min(1),
  id: z.string().min(1),
});

export const deleteContactFormSchema = z.object({
  subaccountId: z.string().min(1),
  id: z.string().min(1),
});

export const funnelFormSchema = z.object({
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1).nullable(),
  subDomainName: z.string().min(1),
  favicon: z.string().min(1).nullable(),
});

export const updateFunnelFormSchema = z.object({
  id: z.string().min(1),
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1).nullable(),
  subDomainName: z.string().min(1),
  favicon: z.string().min(1).nullable(),
});

export const deleteFunnelActionSchema = z.object({
  subaccountId: z.string().min(1),
  funnelId: z.string().min(1),
});

export const funnelPageFormSchema = z.object({
  funnelId: z.string().min(1),
  subaccountId: z.string().min(1),
  name: z.string().min(1),
  pathName: z.string().nullable(),
});

export const updateFunnelPageFormSchema = z.object({
  id: z.string().min(1),
  subaccountId: z.string().min(1),
  funnelId: z.string().min(1),
  name: z.string().min(1),
  pathName: z.string().nullable(),
  order: z.number(),
});

export const createCopyFunnelPageFormSchema = z.object({
  page_id: z.string(),
  subaccountId: z.string().min(1),
});

export const deleteFunnelPageFormSchema = z.object({
  funnelPageId: z.string().min(1),
  subaccountId: z.string().min(1),
});
