import { z } from "zod";

import { memberSchema } from "./models";

export const getInTenantSchema = z.object({
  slug: z.string().trim().min(1, /*i18n*/("Slug cannot be empty")),
})

export const getMemberInTenantSchema = memberSchema;
export type GetMemberInTenantSchema = z.infer<typeof getMemberInTenantSchema>;

export const getMembersInTenantSchema = getMemberInTenantSchema.array();
export type GetMembersInTenantSchema = z.infer<typeof getMembersInTenantSchema>;