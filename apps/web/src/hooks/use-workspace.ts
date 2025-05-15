import { trpc } from "@/lib/trpc/client";
import { useParams } from "next/navigation";

export const useWorkspace = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: workspace } = trpc.workspace.getWithSubscription.useQuery({ slug });
  const member = workspace?.members.find((m) => m.workspaceId === workspace?.id);

  const isOwner = member?.owner;
  const role = member?.role;

  return { isOwner, role, member, slug, workspace };
}