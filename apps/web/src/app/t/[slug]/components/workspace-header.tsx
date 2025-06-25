import { Building, ChevronLeft, Settings, Users } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WorkspaceHeaderProps {
  workspace: {
    name: string
    description?: string
    backgroundImage: string
    isOwner: boolean
    role: string
    memberCount?: number
    projectCount?: number
    slug: string
  }
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  const isBackgroundImage = workspace.backgroundImage.startsWith("http")
  const headerStyle = isBackgroundImage
    ? { backgroundImage: `url(${workspace.backgroundImage})`, backgroundSize: "cover" }
    : { background: workspace.backgroundImage }

  return (
    <div className="relative w-full py-12" style={headerStyle}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="container relative z-10">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" className="text-white" asChild>
            <Link href="/workspaces">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Workspaces
            </Link>
          </Button>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-6 w-6 text-white" />
              <h1 className="text-3xl font-bold text-white">{workspace.name}</h1>
              <div className="flex gap-2">
                {workspace.isOwner && (
                  <Badge variant="secondary" className="bg-white/80 hover:bg-white/90">
                    Proprietário
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-white/80 hover:bg-white/90">
                  {workspace.role === "ADMIN" ? "Admin" : "Membro"}
                </Badge>
              </div>
            </div>
            {workspace.description && <p className="text-white/90 max-w-2xl">{workspace.description}</p>}

            {(workspace.memberCount || workspace.projectCount) && (
              <div className="flex gap-4 mt-4">
                {workspace.memberCount && (
                  <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {workspace.memberCount} membros
                  </div>
                )}
                {workspace.projectCount && (
                  <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                    {workspace.projectCount} projetos
                  </div>
                )}
              </div>
            )}
          </div>
          <Button variant="secondary" asChild>
            <Link href={`/workspaces/${workspace.slug}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
