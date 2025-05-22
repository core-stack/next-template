import { auth } from "@/lib/auth";
import { comparePassword } from "@/lib/authz";
import { Permission } from "@packages/permission";
import { preWorkspaceSchema, prisma } from "@packages/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createWorkspaceSchema, disableWorkspaceSchema, updateWorkspaceSchema, workspaceWithMemberCountSchema
} from "../schema/workspace.schema";
import { protectedProcedure, rbacProcedure, router } from "../trpc";

const slugInUse = async (slug: string) => {
  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  return !!workspace;
}

export const workspaceRouter = router({
  get: protectedProcedure
    .output(workspaceWithMemberCountSchema.array())
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
      return workspaces.map(w => ({ ...w, memberCount: w._count.members }));
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(preWorkspaceSchema)
    .query(async ({ input, ctx }) => {
      const workspace = await prisma.workspace.findUnique({
        where: {
          id: input.id, disabledAt: null,
          members: {
            some: {
              userId: ctx.session.user.id
            }
          }
        }
      });
      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      return workspace;
    }),
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string(), ignoreDisabled: z.boolean().optional() }))
    .output(preWorkspaceSchema)
    .query(async ({ input, ctx }) => {
      const workspace = await prisma.workspace.findUnique({
        where: {
          slug: input.slug,
          disabledAt: input.ignoreDisabled ? undefined : null,
          members: {
            some: {
              userId: ctx.session.user.id
            }
          }
        },
      });
      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      return workspace;
    }),
  getWithSubscription: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const workspace = await prisma.workspace.findUnique({
        where: {
          slug: input.slug,
          members: {
            some: {
              userId: ctx.session.user.id
            }
          }
        },
        include: {
          subscription: true,
          members: {
            where: {
              userId: ctx.session.user.id
            },
          },
          _count: {
            select: {
              members: true
            }
          }
        }
      });
      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      return workspace;
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
          ...input,
          members: {
            create: {
              email: session.user.email,
              owner: true,
              name: session.user.name,
              image: session.user.image,
              role: "WORKSPACE_ADMIN",
              user: { connect: { id: session.user.id } }
            }
          }
        }
      });
      await auth.reloadSession(session.id);
    }),
  existsBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => slugInUse(input.slug)),

  update: rbacProcedure([Permission.UPDATE_WORKSPACE])
    .input(updateWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const res = await prisma.workspace.update({
        where: { id: input.id, disabledAt: null },
        data: input
      });
      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      await auth.reloadSession(session.id);
      return res;
    }),
  disable: rbacProcedure([Permission.DELETE_WORKSPACE])
    .input(disableWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem acesso a esse workspace" });

      if (!user.password)
        throw new TRPCError({ code: "FORBIDDEN", message: "Por favor, defina uma senha para ativar esse workspace" });

      if (!await comparePassword(input.password, user.password))
        throw new TRPCError({ code: "FORBIDDEN", message: "Senha incorreta" });
      const workspace = await prisma.workspace.findUnique({
        where: { slug: input.slug, name: input.confirmText, disabledAt: null },
      });
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      await prisma.workspace.update({ where: { id: workspace.id }, data: { disabledAt: new Date() } });
    }),
  enable: rbacProcedure([Permission.DELETE_WORKSPACE])
    .input(disableWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const userId = session.user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem acesso a esse workspace" });

      if (!user.password)
        throw new TRPCError({ code: "FORBIDDEN", message: "Por favor, defina uma senha para ativar esse workspace" });

      if (!await comparePassword(input.password, user.password))
        throw new TRPCError({ code: "FORBIDDEN", message: "Senha incorreta" });

      await prisma.workspace.update({
        where: { slug: input.slug, disabledAt: { not: null } },
        data: { disabledAt: null }
      });
    }),
});