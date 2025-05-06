import type { ReactNode } from "react"
import { WorkspacesHeader } from '../../components/workspace/workspace-header';

interface ProfileLayoutProps {
  children: ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <>
      <WorkspacesHeader />
      <main>{children}</main>
    </>
  )
}
