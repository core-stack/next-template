import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';
import { workspaceRouter } from './routers/workspace.router';
import { router } from './server';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;