import z from "zod";

export const cronJobOptionsSchema = z.object({
  schedule: z.string(),
  timezone: z.string().optional(),
  runOnInit: z.boolean().default(false).optional(),
  maxExecutions: z.number().optional(),
  maxRandomDelay: z.number().optional(),
  noOverlap: z.boolean().optional(),
  name: z.string().optional(),
  ignore: z.boolean().default(false).optional(),
});

export type CronJobOptions = z.infer<typeof cronJobOptionsSchema>;