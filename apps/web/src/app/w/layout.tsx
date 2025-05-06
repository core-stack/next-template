import type { ReactNode } from "react"
import { WorkspacesHeader } from '../../components/workspace/workspace-header';

interface WorkspacesLayoutProps {
  children: ReactNode
}

export default function WorkspacesLayout({ children }: WorkspacesLayoutProps) {
  return (
    <>
      <WorkspacesHeader />
      <main>{children}</main>
    </>
  )
}
