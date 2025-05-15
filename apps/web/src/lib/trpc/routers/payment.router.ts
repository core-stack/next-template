import { createCheckoutSession, createCustomerPortalSession, getStripeProducts } from "@/lib/stripe";
import { prisma } from "@packages/prisma";
import { PLANS } from "@packages/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const paymentRouter = router({
  getPlans: publicProcedure.query(() => PLANS),
  getProducts: publicProcedure.query(async () => {
    const products = await getStripeProducts();
    return products;
  }),
  checkout: protectedProcedure
    .input(z.object({ priceId: z.string(), slug: z.string() }))
    .mutation(async ({ input }) => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: input.slug },
        include: { subscription: true },
      });
      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      if (!workspace.subscription) {
        const subscription = await prisma.subscription.create({
          data: {
            workspaceId: workspace.id,
            status: "PENDING",
            plan: "free"
          }
        });
        workspace.subscription = subscription;
      }
      if (!workspace.subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Subscription não encontrada" });
      }
      const session = await createCheckoutSession({
        priceId: input.priceId,
        subscription: workspace.subscription
      });
      return session;
    }),
  customerPortal: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      const workspace = await prisma.workspace.findUnique({
        where: { slug: input.slug },
        include: { subscription: true },
      });
      if (!workspace || !workspace.subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace não encontrado" });
      }
      const portal = await createCustomerPortalSession(workspace.subscription, input.slug);
      return portal;
    }),
});
