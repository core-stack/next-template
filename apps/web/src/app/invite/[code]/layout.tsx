import { TenantsHeader } from '@/components/tenant-header';

import type { ReactNode } from "react"

interface InviteLayoutProps {
  children: ReactNode
}

export default function InviteLayout({ children }: InviteLayoutProps) {
  return (
    <>
      <TenantsHeader />
      <main>{children}</main>
    </>
  )
}
