import { prisma } from "@packages/prisma";

import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  self: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        members: { include: { workspace: { select: { id: true, slug: true } }} }
      },
      where: { id: ctx.session.user.id },
    });
    if (!user) return null;
    return user;
  })
});