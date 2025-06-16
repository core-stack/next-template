import { z } from 'zod';

export const passwordSchema = z.string({ message: /*i18n*/("The password is required") })
.min(6, /*i18n*/("The password must be at least 6 characters"))
.max(100, /*i18n*/("The password must be at most 100 characters"));
