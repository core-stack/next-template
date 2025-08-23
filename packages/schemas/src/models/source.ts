import { z } from 'zod';

export const sourceTypeSchema = z.enum(["TEXT", "IMAGE", "VIDEO", "AUDIO", "FILE", "LINK"]);
export const indexStatusSchema = z.enum(["PENDING", "INDEXED", "INDEXING", "ERROR"]);

export const baseSourceSchema = z.object({
  id: z.string().uuid(),

  name: z.string().max(255, { message: /*i18n*/("Name cannot be longer than 255 characters") }),
  description: z.string().optional(),

  originalName: z.string().optional(),
  extension: z.string().optional(),
  contentType: z.string().optional(),
  size: z.number().int().optional(),
  url: z.string().url().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),

  sourceType: sourceTypeSchema,
  indexStatus: indexStatusSchema,
  indexError: z.string().optional(),

  memoryId: z.string().uuid().optional(),
  groupId: z.string().uuid(),
  createdById: z.string().uuid().optional(),
  
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export const withSourceRefinements = <T extends z.ZodType>(schema: T): z.ZodEffects<T> =>
  schema.superRefine((data: any, ctx) => {
    if (!data.originalName && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Original name is required" });
    }
    if (!data.extension && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Extension is required" });
    }
    if (!data.contentType && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Content type is required" });
    }
    if (!data.size && ["IMAGE", "VIDEO", "AUDIO", "FILE"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Size is required" });
    }
    if (!data.width && ["IMAGE", "VIDEO"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Width is required" });
    }
    if (!data.height && ["IMAGE", "VIDEO"].includes(data.sourceType)) {
      ctx.addIssue({ code: "custom", message: "Height is required" });
    }
  });

export const sourceSchema = withSourceRefinements(baseSourceSchema);

export type SourceSchema = z.infer<typeof sourceSchema>;