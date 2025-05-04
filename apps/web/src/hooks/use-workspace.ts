import { useParams } from 'next/navigation';

import { trpc } from '@/lib/trpc/client';

export const useWorkspace = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: user } = trpc.user.self.useQuery();
  const member = user?.members.find((m) => m.workspace.slug === slug);

  const isOwner = member?.owner;
  const role = member?.role;

  return { isOwner, role, member, slug, workspaceId: member?.workspaceId };
}