import { z } from 'zod';

export function getEnv<Schema extends z.ZodTypeAny>(schema: Schema, vars: any): z.infer<Schema> {
  const shouldSkipValidateEnv = () => {
    const skip = process.env.SKIP_ENV_VALIDATION;
    return skip === "true" || skip === "1" || skip === "yes" || skip;
  };

  let env: any
  if (shouldSkipValidateEnv()) {
    console.warn("SKIP_ENV_VALIDATION is not set, skipping env validation");
    env = vars as unknown as Schema;
  } else {
    env = schema.parse(vars);
  }
  return env;
}