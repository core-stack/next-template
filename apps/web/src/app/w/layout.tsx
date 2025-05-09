import type { ReactNode } from "react"


interface WorkspacesLayoutProps {
  children: ReactNode
}

export default function WorkspacesLayout({ children }: WorkspacesLayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
