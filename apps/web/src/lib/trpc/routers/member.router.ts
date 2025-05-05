import { z } from 'zod';

import { hasAccess } from '@/lib/utils';
import { prisma } from '@packages/prisma';
import { TRPCError } from '@trpc/server';

import { memberSchema } from '../schema/member';
import { protectedProcedure, router } from '../trpc';

export const memberRouter = router({
  getInWorkspace: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .output(memberSchema.array())
    .query(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });
      return await prisma.member.findMany({
        where: { workspace: { slug: input.slug, disabledAt: null } },
        include: { user: { select: { id: true, email: true, name: true, image: true }} },
      });
    }),
});