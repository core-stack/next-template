import type { ReactNode } from "react"
import { TenantsHeader } from '@/components/tenant-header';

interface ProfileLayoutProps {
  children: ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <>
      <TenantsHeader />
      <main>{children}</main>
    </>
  )
}
