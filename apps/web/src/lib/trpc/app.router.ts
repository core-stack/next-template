import { authRouter } from "./routers/auth.router";
import { inviteRouter } from "./routers/invite.router";
import { memberRouter } from "./routers/member.router";
import { notificationRouter } from "./routers/notification.router";
import { paymentRouter } from "./routers/payment.router";
import { userRouter } from "./routers/user.router";
import { workspaceRouter } from "./routers/workspace.router";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  member: memberRouter,
  invite: inviteRouter,
  workspace: workspaceRouter,
  notification: notificationRouter,
  payment: paymentRouter
});

export type AppRouter = typeof appRouter;