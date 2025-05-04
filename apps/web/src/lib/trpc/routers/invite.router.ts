import { z } from 'zod';

import { prisma } from '@packages/prisma';

import { protectedProcedure, router } from '../server';

export const inviteRouter = router({
  getByWorkspace: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const invites = await prisma.invite.findMany({
        where: { workspace: { slug: input.slug } },
      });
      return invites;
    }),
});