import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  slug: z
    .string()
    .min(2, { message: "O slug deve ter pelo menos 2 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "O slug deve conter apenas letras minúsculas, números e hífens" }),
  description: z.string().optional(),
  backgroundType: z.enum(["color", "gradient", "image"]),
  backgroundColor: z.string().optional(),
  backgroundGradient: z.string().optional(),
})

export type WorkspaceSchema = z.infer<typeof workspaceSchema>