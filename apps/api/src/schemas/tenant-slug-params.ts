import { z } from 'zod';

import { tenantSlugSchema } from '@packages/schemas';

export const tenantSlugParams = z.object({
  slug: tenantSlugSchema
});
export type TenantSlugParams = z.infer<typeof tenantSlugParams>;