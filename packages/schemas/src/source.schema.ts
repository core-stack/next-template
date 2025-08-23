import z from 'zod';

import { baseSourceSchema, sourceSchema, withSourceRefinements } from './models';

export const getUpdateFilePresignedUrlSchema = z.object({
  fileName: z.string({ message: /*i18n*/("File name is required") })
    .min(1, /*i18n*/("File name cannot be empty")),
  contentType: z.string({ message: /*i18n*/("Content type is required") })
    .min(1, /*i18n*/("Content type cannot be empty")),
  fileSize: z.number({ message: /*i18n*/("File size is required") })
    .max(20 * 1024 * 1024, /*i18n*/("File size must be less than 20MB")),
});
export type GetUpdateFilePresignedUrlSchema = z.infer<typeof getUpdateFilePresignedUrlSchema>;


export const createSourceSchema = withSourceRefinements(baseSourceSchema.omit({
  id: true,
  indexStatus: true,
  indexError: true,
  createdAt: true,
  updatedAt: true,
  groupId: true,
  createdById: true,
  memoryId: true,
})).array();
export type CreateSourceSchema = z.infer<typeof createSourceSchema>;

export const getSourcesSchema = sourceSchema.array();
export type GetSourcesSchema = z.infer<typeof getSourcesSchema>;