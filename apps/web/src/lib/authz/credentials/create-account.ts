import { prisma } from "@packages/prisma";
import { z } from "zod";

import { hashPassword } from "./utils";

const createAccountSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type CreateAccountSchema = z.infer<typeof createAccountSchema>;

export const createAccount = async (schema: CreateAccountSchema) => {
  // validate
  let { email, name, password } = await createAccountSchema.parseAsync(schema);
  // verify email in use
  const userWithEmail = await prisma.user.findUnique({where: { email: email }});
  if (userWithEmail) throw new Error("Email already in use");

  // hash password
  password = await hashPassword(password);

  // create user
  const user = await prisma.user.create({
    data: {
      email, name, password,
      verificationToken: {
        create: {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          type: "ACTIVE_ACCOUNT"
        }
      }
    }
  });
  user.password = null;
  return user
}