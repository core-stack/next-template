import { randomBytes } from "crypto";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenvExpand.expand(dotenv.config({ path: path.resolve(__dirname, '../../.env') }));

const envSchema = z.object({
  REDIS_URL: z.string().url(),

  SMTP_ENABLED: z.string().transform((val) => val === "true").default("false"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform((val) => parseInt(val)),
  SMTP_USER: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_ENV: z.enum(["development", "production"]).default("development"),
  SMTP_TEST_EMAIL: z.string().email().default("delivered@resend.dev").optional(),
  SMTP_SECURE: z.string().transform((val) => val === "true").default("false"),

  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URL: z.string().optional(),

  JWT_SECRET: z.string().default(randomBytes(32).toString('hex')),
  JWT_ACCESS_TOKEN_DURATION: z.coerce.number().default(60 * 5), // 5 minutes
  JWT_REFRESH_TOKEN_DURATION: z.coerce.number().default(60 * 60 * 24 * 7), // 7 days

  SESSION_DURATION: z.coerce.number().default(60 * 60), // 1 hour
  SESSION_STORE: z.enum(["memory", "redis"]).default("memory"),

  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ENDPOINT: z.string(),
  AWS_BUCKET: z.string(),
  AWS_PUBLIC_BUCKET_BASE_URL: z.string().url(),

  WORKSPACE_INVITE_EXPIRES: z.coerce.number().default(60 * 60 * 24 * 7), // 7 days

  APP_URL: z.string().url().default('http://localhost:3000'),

  DISABLED_WORKSPACES_DELETE_AFTER: z.coerce.number().default(60 * 60 * 24 * 90), // 90 days

  ACTIVE_ACCOUNT_TOKEN_EXPIRES: z.coerce.number().default(60 * 60 * 24 * 1000), // 1 day

  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
})
type Env = z.infer<typeof envSchema>;

let env: Env

const shouldSkipValidation = () => {
  const skip = process.env.SKIP_ENV_VALIDATION;
  return skip === "true" || skip === "1" || skip === "yes" || skip;
};

if (shouldSkipValidation()) {
  console.log("SKIP_ENV_VALIDATION is set, skipping env validation");
  env = process.env as unknown as Env;
} else {
  env = envSchema.parse(process.env);
}

export { env };