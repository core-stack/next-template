import { Session } from "@/lib/authz/session";
import { prisma } from "@packages/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { memberSchema } from "../schema/member";
import { protectedProcedure, router } from "../trpc";

const hasAccess = (session: Session, slug: string) => session.workspaces.some((w) => w.slug === slug);

export const memberRouter = router({
  getInWorkspace: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .output(memberSchema.array())
    .query(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });
      return await prisma.member.findMany({
        where: { workspace: { slug: input.slug } },
        include: { user: { select: { id: true, email: true, name: true, image: true }} },
      });
    }),
});