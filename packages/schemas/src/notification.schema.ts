import { z } from "zod";

export const syncSchema = z.object({
  token: z.string().trim().min(1),
  slug: z.string().trim().min(1)
})

export const markAsReadSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().trim().min(1)
})

export const markAllAsReadSchema = z.object({
  slug: z.string().trim().min(1)
})

export const deleteSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().trim().min(1)
})