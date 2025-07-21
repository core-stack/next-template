import { redirect } from 'next/navigation';

import { fetchApi } from '@/lib/fetcher';

import { InviteAcceptance } from './invite-acceptance';

type Props = { params: Promise<{ code: string }> };
export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const { data: invite, error } = await fetchApi("[GET] /api/invite/:id", { params: { id: code } });
  if (error) {
    redirect("/t");
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10 m-auto">
      <InviteAcceptance invite={invite!} />
    </div>
  )
}