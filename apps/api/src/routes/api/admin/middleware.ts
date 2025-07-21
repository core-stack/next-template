import { authMiddleware, rbacMiddleware } from "@/plugins/auth/middlewares";
import { Permission } from "@packages/permission";

export default [authMiddleware, rbacMiddleware(Permission.MANAGE_TENANT)];