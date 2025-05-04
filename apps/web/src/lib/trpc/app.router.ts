import { authRouter } from './routers/auth.router';
import { inviteRouter } from './routers/invite.router';
import { memberRouter } from './routers/member.router';
import { userRouter } from './routers/user.router';
import { workspaceRouter } from './routers/workspace.router';
import { router } from './server';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  member: memberRouter,
  invite: inviteRouter,
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;