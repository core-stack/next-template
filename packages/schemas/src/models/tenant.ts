import { z } from 'zod';

export const tenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  slug: z
    .string()
    .min(2, { message: "O slug deve ter pelo menos 2 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "O slug deve conter apenas letras minúsculas, números e hífens" }),
  description: z.string().optional(),
  backgroundImage: z.string(),
  disabledAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
export type TenantSchema = z.infer<typeof tenantSchema>;