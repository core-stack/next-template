
import { RouterOutput } from "@/lib/trpc/app.router";
import { caller } from "@/lib/trpc/server";
import { redirect } from "next/navigation";

import { InviteAcceptance } from "./invite-acceptance";

type Props = {
  params: Promise<{
    code: string
  }>
}
export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  let invite: RouterOutput["invite"]["getByIdWithWorkspace"] | null = null;
  try {
    invite = await caller.invite.getByIdWithWorkspace({ id: code });
    if (!invite) redirect("/w");
  } catch (error) {
    redirect("/w");
  }
  if (!invite) redirect("/w");

  return (
    <div className="container flex items-center justify-center min-h-screen py-10 m-auto">
      <InviteAcceptance invite={invite!} />
    </div>
  )
}