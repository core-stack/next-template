import { NotificationsProvider } from "@/context/notifications";
import { fetchApi } from "@/lib/fetcher";
import { redirect } from "next/navigation";

import { TenantSidebar } from "./components/tenant-sidebar";

import type { ReactNode } from "react"
interface WorkspaceLayoutProps {
  children: ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = await params;
  const { data, success } = await fetchApi("[GET] /api/tenant/:slug", { params: { slug } });
  if (!success) {
    redirect("/w");
  }
  if (data!.disabledAt) redirect(`/w/reactivate/${slug}`);

  return (
    <NotificationsProvider>
      <div className="flex min-h-screen">
        <TenantSidebar slug={slug} tenant={data!} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </NotificationsProvider>
  )
}
