import { getEnv } from "@packages/env";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();
const envBool = z.string().transform(v => v === "true");
const envSchema = z.object({
  DEFAULT_INVITE_EXPIRES: z.coerce.number().default(7 * 60 * 60 * 24 * 1000), // 7 day
  DISABLED_WORKSPACES_DELETE_AFTER: z.coerce.number().default(90 * 24 * 60 * 60 * 1000), // 90 days

  JWT_SECRET: z.string().default("change-me"),
  JWT_ACCESS_TOKEN_DURATION: z.coerce.number().default(60 * 5 * 1000), // 5 min
  JWT_REFRESH_TOKEN_DURATION: z.coerce.number().default(60 * 60 * 24 * 30 * 1000), // 30 days

  ACTIVE_ACCOUNT_TOKEN_EXPIRES: z.coerce.number().default(60 * 60 * 1000), // 1h
  RESET_PASSWORD_TOKEN_EXPIRES: z.coerce.number().default(60 * 60 * 1000), // 1h
  ALLOW_CREATE_ACCOUNT: envBool.default("true"),

  REDIS_URL: z.string().url().default("redis://localhost:6379"),

  AUTH_STORE_TYPE: z.enum(["redis", "memory"]).default("memory"),

  STORAGE_ENABLED: envBool.default("false"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ENDPOINT: z.string().optional(),
  AWS_PUBLIC_BUCKET_BASE_URL: z.string().optional(),
  AWS_BUCKET: z.string().optional(),

  API_PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  SMTP_ENABLED: envBool.default("false"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: envBool.default("false"),
  SMTP_USER: z.string().optional(),
  SMTP_ENV: z.enum(["development", "production", "test"]).default("development"),
  SMTP_TEST_EMAIL: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),

  DEFAULT_USER_EMAIL: z.string().email().default("admin@example.com"),
  DEFAULT_USER_PASSWORD: z.string().default("admin"),
  DEFAULT_USER_NAME: z.string().default("admin"),
}).superRefine((data, ctx) => {
  if (
    data.STORAGE_ENABLED &&
    (
      !data.AWS_ACCESS_KEY_ID ||
      !data.AWS_SECRET_ACCESS_KEY ||
      !data.AWS_REGION ||
      !data.AWS_BUCKET ||
      !data.AWS_PUBLIC_BUCKET_BASE_URL
    )
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "AWS credentials are required when STORAGE_ENABLED is true",
    })
  }
  if (
    data.SMTP_ENABLED &&
    (
      !data.SMTP_HOST ||
      !data.SMTP_PORT ||
      !data.SMTP_USER ||
      !data.SMTP_PASSWORD ||
      !data.SMTP_FROM
    )
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "SMTP configuration is incomplete",
    });
  }
});

export const env = getEnv(envSchema, process.env);
export type Env = typeof env;
