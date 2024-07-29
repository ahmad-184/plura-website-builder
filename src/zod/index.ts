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
