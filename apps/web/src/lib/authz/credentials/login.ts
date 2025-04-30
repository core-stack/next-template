import { prisma } from "@packages/prisma";
import { z } from "zod";

import { generateTokens } from "../jwt";

import { comparePassword } from "./utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const login = async (schema: LoginSchema) => {
  const { email, password } = await loginSchema.parseAsync(schema);

  const user = await prisma.user.findUnique({ where: { email }, include: { members: true } });
  if (!user) throw new Error("Invalid credentials");
  if (!user.password) throw new Error("Invalid credentials");
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  return generateTokens(user);
};
