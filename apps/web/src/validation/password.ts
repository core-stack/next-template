import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  .max(100, { message: "A senha deve ter no máximo 100 caracteres" });
