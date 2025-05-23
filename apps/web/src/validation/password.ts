import { z } from "zod/v4";

export const passwordSchema = z.string().min(6).max(100);
