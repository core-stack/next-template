import type { Metadata } from "next"
import { redirect } from 'next/navigation';

import { WorkspacesHeader } from '@/components/workspace/workspace-header';
import { auth } from '@/lib/auth';
import { WorkspaceSchema } from '@/lib/trpc/schema/workspace';
import { caller } from '@/lib/trpc/server';
import { TRPCError } from '@trpc/server';

import { ReactivateWorkspaceForm } from './reactivate-form';

interface ReactivateWorkspacePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ReactivateWorkspacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const workspace = await caller.workspace.getBySlug({ slug, ignoreDisabled: true });
  return {
    title: `Reativar ${workspace?.name}`,
    description: `Reative seu workspace "${workspace?.name}" antes que seja excluído permanentemente`,
  }
}

export default async function ReactivateWorkspacePage({ params }: ReactivateWorkspacePageProps) {
  const { slug } = await params
  let workspace: WorkspaceSchema | undefined;
  try {
    workspace = await caller.workspace.getBySlug({ slug, ignoreDisabled: true })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") redirect("/w")
    else throw error
  }
  if (!workspace) redirect("/w")
  try {
    const session = await auth.getSession()
    if (!session?.user) redirect("/w")
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") redirect("/w")
    else throw error
  }

  return (
    <>
      <WorkspacesHeader />
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <ReactivateWorkspaceForm workspace={workspace} />
        </div>
      </div>
    </>
  )
}
