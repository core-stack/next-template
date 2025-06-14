import { z } from 'zod';

export function getEnv<Schema extends z.ZodTypeAny>(schema: Schema, vars: any): z.infer<Schema> {
  const shouldValidateEnv = () => {
    const skip = process.env.ENV_VALIDATION;
    return skip === "true" || skip === "1" || skip === "yes" || skip;
  };

  let env: any
  if (shouldValidateEnv()) {
    env = schema.parse(vars);
  } else {
    console.warn("ENV_VALIDATION is not set, skipping env validation");
    env = vars as unknown as Schema;
  }
  return env;
}