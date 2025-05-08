import { WorkspacesHeader } from '@/components/workspace/workspace-header';

import type { ReactNode } from "react"

interface InviteLayoutProps {
  children: ReactNode
}

export default function InviteLayout({ children }: InviteLayoutProps) {
  return (
    <>
      <WorkspacesHeader />
      <main>{children}</main>
    </>
  )
}
