import {
  agencyDetailFormSchema,
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
import { z } from "zod";

export type SidebarType = "agency" | "subaccount";

export type SeenedNotifsType = {
  [id: string]: {
    account_id: string;
    amount: string;
  };
};

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

export type deleteUserActionSchemaType = z.infer<typeof deleteUserActionSchema>;

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
