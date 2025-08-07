import { z } from "zod";

import { memberSchema, notificationSchema } from "./models";

export const syncSchema = z.object({
  token: z.string({ message: /*i18n*/("Token is required") })
    .trim()
    .min(1, /*i18n*/("Token cannot be empty")),
});

export const markAsReadSchema = z.object({
  id: z.string({ message: /*i18n*/("ID is required") })
    .uuid(/*i18n*/("ID must be a valid UUID")),
});
export type MarkAsReadSchema = z.infer<typeof markAsReadSchema>;

export const deleteSchema = z.object({
  id: z.string({ message: /*i18n*/("ID is required") })
    .uuid(/*i18n*/("ID must be a valid UUID")),
});

export const getNotificationsSchema = notificationSchema.extend({
  createdBy: memberSchema.or(z.undefined())
}).array();
export type GetNotificationsSchema = z.infer<typeof getNotificationsSchema>;