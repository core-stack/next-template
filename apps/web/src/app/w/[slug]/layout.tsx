import { redirect } from 'next/navigation';

import { WorkspaceSchema } from '@/lib/trpc/schema/workspace';
import { caller } from '@/lib/trpc/server';
import { TRPCError } from '@trpc/server';

import { WorkspaceSidebar } from './workspace-sidebar';

import type { ReactNode } from "react"
interface WorkspaceLayoutProps {
  children: ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = await params;
  let workspace: WorkspaceSchema | undefined;
  try {
    workspace = await caller.workspace.getBySlug({ slug });
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === "NOT_FOUND") {
        redirect("/w");
      }
    }
  }
  if (!workspace) {
    redirect("/w");
  }
  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar slug={slug} currentWokspace={workspace} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
