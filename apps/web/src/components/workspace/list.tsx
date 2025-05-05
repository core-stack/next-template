"use client"

import { ArrowBigRight, Building, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { WorkspaceWithCountSchema } from '@/lib/trpc/schema/workspace';

import { Badge } from '../ui/badge';
import { WorkspaceDialog } from './create-or-update-dialog';

export function WorkspaceList() {
  const { data: workspaces = [] } = trpc.workspace.get.useQuery();
  const { data: user } = trpc.user.self.useQuery();

  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithCountSchema | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEditWorkspace = (workspace: WorkspaceWithCountSchema) => {
    setSelectedWorkspace(workspace)
    setIsDialogOpen(true)
  }

  const handleCreateWorkspace = () => {
    setSelectedWorkspace(null)
    setIsDialogOpen(true)
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <WorkspaceCard 
            key={workspace.id}
            workspace={workspace}
            onEdit={() => handleEditWorkspace(workspace)}
            role={user?.members.find((m) => m.workspaceId === workspace.id)?.role}
          />
        ))}
        <CreateWorkspaceCard onClick={handleCreateWorkspace} />
      </div>

      <WorkspaceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        workspace={selectedWorkspace}
      />
    </>
  )
}

function WorkspaceCard({ workspace, onEdit, role }: { workspace: WorkspaceWithCountSchema; onEdit: () => void, role?: string }) {
  const cardStyle = { background: workspace.backgroundColor || workspace.backgroundGradient }

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
      <div className="h-32 w-full relative" style={cardStyle}>
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-yellow-300 hover:bg-yellow-400 text-black">
            {role}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5 text-muted-foreground" />
          {workspace.name}
        </CardTitle>
        <CardDescription>{workspace.description || "Sem descrição"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{workspace.memberCount} membros</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/w/${workspace.slug}`}>
            <ArrowBigRight className="mr-2 h-4 w-4" />
            Entrar
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Settings className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </CardFooter>
    </Card>
  )
}

function CreateWorkspaceCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      className="border-2 border-dashed hover:border-primary hover:cursor-pointer flex flex-col items-center justify-center h-full min-h-[300px]"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center pt-6">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Criar Workspace</h3>
        <p className="text-sm text-muted-foreground text-center mt-2">Crie uma nova organização ou área de trabalho</p>
      </CardContent>
    </Card>
  )
}
