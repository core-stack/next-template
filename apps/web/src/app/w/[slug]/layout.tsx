import { WorkspaceSidebar } from './workspace-sidebar';

import type { ReactNode } from "react"

interface WorkspaceLayoutProps {
  children: ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = await params

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar slug={slug} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
