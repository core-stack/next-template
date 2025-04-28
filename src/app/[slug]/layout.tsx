import { WorkspaceSidebar } from './workspace-sidebar';

import type { ReactNode } from "react"

interface WorkspaceLayoutProps {
  children: ReactNode
  params: {
    slug: string
  }
}

export default function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = params

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar slug={slug} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
