import { publicProcedure, router } from "@/trpc/init";

export const userRouter = router({
  me: publicProcedure.query(() => ({ id: '123', name: 'Alice' })),
});
