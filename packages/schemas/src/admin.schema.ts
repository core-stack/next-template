import { z } from "zod";

export const getByCursorSchema = z.object({
  cursor: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
export type GetByCursorSchema = z.infer<typeof getByCursorSchema>;

export const revokeSessionSchema = z.object({
  sessionId: z.string({ message: /*i18n*/("Session ID is required") })
    .uuid(/*i18n*/("Session ID must be a valid UUID")),
})
export type RevokeSessionSchema = z.infer<typeof revokeSessionSchema>;