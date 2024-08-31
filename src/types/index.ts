import {
  agencyDetailFormSchema,
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
  initUserActionSchema,
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
import { Contact, Lane, Prisma, Tag, Ticket, User } from "@prisma/client";
import { z } from "zod";

export type SidebarType = "agency" | "subaccount";

export type SeenedNotifsType = {
  [id: string]: {
    account_id: string;
    amount: string;
  };
};

export type TicketWithAllRelatedDataType = Ticket & {
  Tags: Tag[];
  Assigned: User | null;
  Customer: Contact | null;
};

export type LaneFullDataType = Lane & {
  Tickets: TicketWithAllRelatedDataType[];
};

export type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;

export type verifyEmailFormSchemaType = z.infer<typeof verifyEmailFormSchema>;

export type signInFormSchemaType = z.infer<typeof signInFormSchema>;

export type forgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordFormSchema
>;

export type resetPasswordFormSchemaType = z.infer<
  typeof resetPasswordFormSchema
>;

export type deletePipelineActionSchemaType = z.infer<
  typeof deletePipelineActionSchema
>;

export type agencyFormSchemaType = z.infer<typeof agencyDetailFormSchema>;

export type createAgencyActionSchemaType = z.infer<
  typeof createAgencyActionSchema
>;

export type updateAgencyActionSchemaType = z.infer<
  typeof updateAgencyActionSchema
>;

export type updateGoalActionSchemaType = z.infer<typeof updateGoalActionSchema>;

export type deleteSubaccountActionSchemaType = z.infer<
  typeof deleteSubaccountActionSchema
>;

export type sendInvitationSchemaType = z.infer<typeof sendInvitationSchema>;

export type removeUserAccessToAgencyActionSchemaType = z.infer<
  typeof removeUserAccessToAgencyActionSchema
>;

export type deleteAgencyActionSchemaType = z.infer<
  typeof deleteAgencyActionSchema
>;

export type updatePipelineActionSchemaType = z.infer<
  typeof updatePipelineActionSchema
>;

export type createPipelineSchemaType = z.infer<typeof createPipelineSchema>;

export type deleteMediaActionSchemaType = z.infer<
  typeof deleteMediaActionSchema
>;

export type createSubaccountActionSchemaType = z.infer<
  typeof createSubaccountActionSchema
>;

export type updateSubaccountActionSchemaType = z.infer<
  typeof updateSubaccountActionSchema
>;

export type uploadMediaActionSchemaType = z.infer<
  typeof uploadMediaActionSchema
>;

export type updateUserActionSchemaType = z.infer<typeof updateUserActionSchema>;

export type changeUserPermissionActionSchemaType = z.infer<
  typeof changeUserPermissionActionSchema
>;

export type initUserActionSchemaType = z.infer<typeof initUserActionSchema>;

export type createLineFormSchemaType = z.infer<typeof createLineFormSchema>;

export type updateLineFormSchemaType = z.infer<typeof updateLineFormSchema>;

export type deleteLaneActionSchemaType = z.infer<typeof deleteLaneActionSchema>;

export type ticketFormSchemaType = z.infer<typeof ticketFormSchema>;

export type createTicketSchemaType = {
  data: z.infer<typeof ticketFormSchema>;
  tags: Tag[];
};

export type updateTicketSchemaType = {
  data: z.infer<typeof updateTicketSchema>;
  tags: Tag[];
};

export type createTagSchemaType = z.infer<typeof createTagSchema>;

export type deleteTagSchemaType = z.infer<typeof deleteTagSchema>;

export type deleteTicketSchemaType = z.infer<typeof deleteTicketSchema>;

export type contactFormSchemaType = z.infer<typeof contactFormSchema>;

export type createContactFormSchemaType = z.infer<
  typeof createContactFormSchema
>;

export type updateContactFormSchemaType = z.infer<
  typeof updateContactFormSchema
>;

export type deleteContactFormSchemaType = z.infer<
  typeof deleteContactFormSchema
>;

export type funnelFormSchemaType = z.infer<typeof funnelFormSchema>;

export type updateFunnelFormSchemaType = z.infer<typeof updateFunnelFormSchema>;

export type deleteFunnelActionSchemaType = z.infer<
  typeof deleteFunnelActionSchema
>;
export type funnelPageFormSchemaType = z.infer<typeof funnelPageFormSchema>;

export type updateFunnelPageFormSchemaType = z.infer<
  typeof updateFunnelPageFormSchema
>;

export type createCopyFunnelPageFormSchemaType = z.infer<
  typeof createCopyFunnelPageFormSchema
>;

export type deleteFunnelPageFormSchemaType = z.infer<
  typeof deleteFunnelPageFormSchema
>;
