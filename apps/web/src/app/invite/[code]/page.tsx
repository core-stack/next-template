
import { InviteWithWorkspaceSchema } from "@/lib/trpc/schema/invite";
import { caller } from "@/lib/trpc/server";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

import { InviteAcceptance } from "./invite-acceptance";

type Props = {
  params: Promise<{
    code: string
  }>
}
export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  let invite: InviteWithWorkspaceSchema | null = null;
  try {
    invite = await caller.invite.getByIdWithWorkspace({ id: code });
    if (!invite) redirect("/");
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === "NOT_FOUND") redirect("/");
      if (error.code === "FORBIDDEN") redirect("/");
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <InviteAcceptance invite={invite!} />
    </div>
  )
}