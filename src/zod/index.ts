import { z } from "zod";

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
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

export const sendInvitationSchema = z.object({
  email: z.string().email().min(1),
  role: z.enum(["AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]),
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
  z.object({ customerId: z.string(), id: z.string() })
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

export const deleteUserActionSchema = z.object({
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
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
  agencyId: z.string(),
});
