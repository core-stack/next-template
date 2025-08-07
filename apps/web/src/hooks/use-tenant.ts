import { useAuth } from "@/context/auth";
import { useParams } from "next/navigation";

import { useApiQuery } from "./use-api-query";

export const useTenant = () => {
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const { data: tenant } = useApiQuery("[GET] /api/tenant/:slug", { params: { slug } });
  const member = user?.members.find((m) => m.tenantId === tenant?.id);

  const isOwner = member?.owner;
  const role = member?.role;

  return { isOwner, role, member, slug, tenant };
}