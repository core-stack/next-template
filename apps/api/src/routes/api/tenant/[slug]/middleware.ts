import { authMiddleware, tenantMiddleware } from '@/plugins/auth/middlewares';

export default [authMiddleware, tenantMiddleware];