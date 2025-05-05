import { z } from 'zod';

import { comparePassword } from '@/lib/authz';
import { prisma, Workspace } from '@packages/prisma';
import { TRPCError } from '@trpc/server';

import {
  createWorkspaceSchema, disableWorkspaceSchema, updateWorkspaceSchema, WorkspaceSchema,
  workspaceSchema, workspaceWithCountSchema
} from '../schema/workspace';
import { protectedProcedure, router } from '../trpc';

const slugInUse = async (slug: string) => {
  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  return !!workspace;
}

const formatWorkspace = (workspace: Workspace) => {
  return {
    ...workspace,
    backgroundType: workspace.backgroundImage.startsWith("#") ? "color" : "gradient",
    description: workspace.description ?? undefined,
    backgroundColor: workspace.backgroundImage.startsWith("#") ? workspace.backgroundImage : undefined,
    backgroundGradient: workspace.backgroundImage.startsWith("#") ? undefined : workspace.backgroundImage
  } as WorkspaceSchema;
}
export const workspaceRouter = router({
  get: protectedProcedure
    .output(workspaceWithCountSchema.array())
    .query(async ({ ctx }) => {
      const workspaces = await prisma.workspace.findMany({
        where: {
          members: {
            some: {
              userId: ctx.session.user.id
            }
          }
        },
        include: {
          _count: {
            select: {
              members: true
            }
          }
        }
      });
      return workspaces.map(w => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        backgroundType: w.backgroundImage.startsWith("#") ? "color" : "gradient",
        backgroundColor: w.backgroundImage.startsWith("#") ? w.backgroundImage : undefined,
        backgroundGradient: w.backgroundImage.startsWith("#") ? undefined : w.backgroundImage,
        description: w.description ?? undefined,
        memberCount: w._count.members,
        disabledAt: w.disabledAt ?? undefined
      }));
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(workspaceSchema)
    .query(async ({ input }) => {
      const workspace = await prisma.workspace.findUnique({
        where: {
          id: input.id, disabledAt: null
        }
      });
      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      return formatWorkspace(workspace);
    }),
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .output(workspaceSchema)
    .query(async ({ input }) => {
      const workspace = await prisma.workspace.findUnique({ where: { slug: input.slug, disabledAt: null } });
      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      return formatWorkspace(workspace);
    }),
  create: protectedProcedure
    .input(createWorkspaceSchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      if (await slugInUse(input.slug)) {
        throw new TRPCError({ code: "CONFLICT", message: "Slug já em uso" });
      }
      await prisma.workspace.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          backgroundImage: (input.backgroundType === "color" ? input.backgroundColor : input.backgroundGradient) || "",
          members: {
            create: {
              email: session.user.email,
              owner: true,
              role: "WORKSPACE_ADMIN",
              user: {
                connect: {
                  id: session.user.id
                }
              }
            }
          }
        }
      });
    }),
  existsBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => slugInUse(input.slug)),

  update: protectedProcedure
    .input(updateWorkspaceSchema)
    .mutation(async ({ input }) => {
      const res = await prisma.workspace.update({
        where: { id: input.id, disabledAt: null },
        data: {
          name: input.name,
          description: input.description,
          backgroundImage: (input.backgroundType === "color" ? input.backgroundColor : input.backgroundGradient) || "",
        }
      });
      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      return formatWorkspace(res);
    }),
  disable: protectedProcedure
    .input(disableWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem acesso a esse workspace" });
      if (!user.password) throw new TRPCError({ code: "FORBIDDEN", message: "Por favor, defina uma senha para ativar esse workspace" });
      if (!await comparePassword(input.password, user.password)) throw new TRPCError({ code: "FORBIDDEN", message: "Senha incorreta" });
      const workspace = await prisma.workspace.findUnique({
        where: { slug: input.slug, name: input.confirmText, disabledAt: null },
      });
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      await prisma.workspace.update({ where: { id: workspace.id }, data: { disabledAt: new Date() } });
    }),
  enable: protectedProcedure
    .input(disableWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem acesso a esse workspace" });
      if (!user.password) throw new TRPCError({ code: "FORBIDDEN", message: "Por favor, defina uma senha para ativar esse workspace" });
      if (!await comparePassword(input.password, user.password)) throw new TRPCError({ code: "FORBIDDEN", message: "Senha incorreta" });

      await prisma.workspace.update({
        where: { slug: input.slug, disabledAt: { not: null } },
        data: { disabledAt: null }
      });
    }),
});