import { randomBytes } from "crypto";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import path from "path";
import { z } from "zod";

// Try to load .env from multiple possible locations
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  try {
    const result = dotenv.config({ path: envPath, override: true });
    if (!result.error) {
      dotenvExpand.expand(result);
      envLoaded = true;
      console.log(`Loaded .env from ${envPath}`);
      break;
    }
  } catch (error) {
    // Continue to next path
  }
}

if (!envLoaded) {
  console.warn('No .env file found in any of the expected locations');
}

const envSchema = z.object({
  REDIS_URL: z.string().url(),

  SMTP_ENABLED: z.string().transform((val) => val === "true").default("false"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform((val) => parseInt(val)),
  SMTP_USER: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_ENV: z.enum(["development", "production"]).default("development"),
  SMTP_TEST_EMAIL: z.string().email().default("delivered@resend.dev"),
  SMTP_SECURE: z.string().transform((val) => val === "true").default("true"),

  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URL: z.string().optional(),

  JWT_SECRET: z.string().default(randomBytes(32).toString('hex')),
  JWT_ACCESS_TOKEN_DURATION: z.string().default(`${60 * 5}`).transform((val) => parseInt(val)), // 5 minutes
  JWT_REFRESH_TOKEN_DURATION: z.string().default(`${60 * 60 * 24 * 7}`).transform((val) => parseInt(val)), // 7 days

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

let env: Env;

export function validateEnv(schema: z.ZodSchema, vars: any) {
  const shouldValidateEnv = () => {
    const skip = process.env.ENV_VALIDATION;
    return skip === "true" || skip === "1" || skip === "yes" || skip;
  };

  const mergedEnv = { ...process.env, ...vars };

  if (shouldValidateEnv()) {
    env = schema.parse(mergedEnv);
  } else {
    console.warn("ENV_VALIDATION is not set, skipping env validation");
    env = mergedEnv as unknown as Env;
  }
  return env;
}

env = validateEnv(envSchema, process.env);

export function getEnv() {
  return validateEnv(envSchema, process.env);
}

export { env };