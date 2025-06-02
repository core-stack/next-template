import { NotificationsProvider } from "@/context/notifications";
import { PermissionProvider } from "@/context/permission";
import { RouterOutput } from "@/lib/trpc/app.router";
import { caller } from "@/lib/trpc/server";
import { redirect } from "next/navigation";

import { WorkspaceSidebar } from "./components/workspace-sidebar";

import type { ReactNode } from "react"
interface WorkspaceLayoutProps {
  children: ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = await params;
  let workspace: RouterOutput["workspace"]["getBySlug"] | undefined;
  try {
    workspace = await caller.workspace.getBySlug({ slug, ignoreDisabled: true });
  } catch (error) {
    redirect("/w");
  }
  if (!workspace) redirect("/w");
  if (workspace.disabledAt) redirect(`/w/reactivate/${slug}`);

  return (
    <NotificationsProvider>
      <PermissionProvider>
        <div className="flex min-h-screen">
          <WorkspaceSidebar slug={slug} currentWokspace={workspace} />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </PermissionProvider>
    </NotificationsProvider>
  )
}
