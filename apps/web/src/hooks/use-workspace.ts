import { Member, Workspace } from "@packages/prisma";
import useSWR from "swr";

export const useWorkspace = () => {
  return useSWR<Array<Workspace & { member: Member }>>('/api/workspace')
}