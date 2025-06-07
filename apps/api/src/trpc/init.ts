import { Permission } from "@packages/permission";
import { initTRPC } from "@trpc/server";

import { Context } from "./context";
import { authMiddleware } from "./middlewares/auth.middleware";
import { rbacMiddleware } from "./middlewares/rbac.middleware";

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;

export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(authMiddleware);

export const rbacProcedure = (...permissions: Permission[]) =>
  authProcedure.use(rbacMiddleware(...permissions));