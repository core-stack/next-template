
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@packages/prisma';

import { InviteAcceptance } from './invite-acceptance';

// preciso pegar a sessão do usuario
type Props = {
  params: Promise<{
    code: string
  }>
}
export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const cookieStore = await cookies();
  const session = await auth.getSession(cookieStore.get("access-token")?.value);
  if (!session) redirect("/auth/login");
  const invite = await prisma.invite.findUnique({
    where: { id: code },
    include: { workspace: { include: { members: true } } },
  });

  if (!invite) redirect("/");
  if (invite.email !== session.user.email) redirect("/");
  if (invite.workspace.members.some((member) => member.userId === session.user.id)) {
    await prisma.invite.delete({ where: { id: code } });
    redirect(`/w/${invite.workspace.slug}`);
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <InviteAcceptance invite={invite} />
    </div>
  )
}