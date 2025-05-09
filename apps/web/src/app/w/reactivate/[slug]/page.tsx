import type { Metadata } from "next"
import { WorkspacesHeader } from '@/components/workspace/workspace-header';
import { caller } from '@/lib/trpc/server';

import { ReactivateWorkspaceForm } from './reactivate-form';

interface ReactivateWorkspacePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ReactivateWorkspacePageProps): Promise<Metadata> {
  return {
    title: "Reativar Workspace",
    description: "Reative seu workspace antes que seja excluído permanentemente",
  }
}

export default async function ReactivateWorkspacePage({ params }: ReactivateWorkspacePageProps) {
  const { slug } = await params
  const workspace = await caller.workspace.getBySlug({ slug, ignoreDisabled: true })

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
