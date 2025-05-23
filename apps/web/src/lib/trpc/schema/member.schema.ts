import { z } from "zod/v4";

export const getInWorkspaceSchema = z.object({
  slug: z.string().trim().min(1),
})