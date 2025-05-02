"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/use-workspace";
import { Workspace } from "@packages/prisma";
import { Building, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { WorkspaceDialog } from "./dialog";

export function WorkspaceList() {
  const { data: workspaces, mutate } = useWorkspace();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEditWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedWorkspace(null)
    setIsDialogOpen(false)
  }

  const handleSaveWorkspace = (updatedWorkspace: Partial<Workspace>) => {
    if (selectedWorkspace) {
      setWorkspaces(workspaces.map((w) => (w.id === selectedWorkspace.id ? { ...w, ...updatedWorkspace } : w)))
    } else {
      // Lógica para adicionar novo workspace
      const newWorkspace: Workspace = {
        id: `${workspaces.length + 1}`,
        slug: updatedWorkspace.slug || `workspace-${workspaces.length + 1}`,
        name: updatedWorkspace.name || "Novo Workspace",
        description: updatedWorkspace.description || null,
        backgroundImage: updatedWorkspace.backgroundImage || "linear-gradient(to right, #6366f1, #a855f7)",
        createdAt: new Date(),
        updatedAt: new Date(),
        isOwner: true,
        role: "ADMIN",
        projectCount: 0,
        memberCount: 1,
      }
      setWorkspaces([...workspaces, newWorkspace])
    }
    handleCloseDialog()
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces?.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} onEdit={() => handleEditWorkspace(workspace)} />
        ))}
        <CreateWorkspaceCard onClick={() => setIsDialogOpen(true)} />
      </div>

      <WorkspaceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        workspace={selectedWorkspace}
      />
    </>
  )
}

function WorkspaceCard({ workspace, onEdit }: { workspace: Workspace; onEdit: () => void }) {
  const isBackgroundImage = workspace.backgroundImage.startsWith("http")
  const cardStyle = isBackgroundImage
    ? { backgroundImage: `url(${workspace.backgroundImage})`, backgroundSize: "cover" }
    : { background: workspace.backgroundImage }

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
      <div className="h-32 w-full relative" style={cardStyle}>
        <div className="absolute top-2 right-2 flex gap-2">
          {/* {workspace. && (
            <Badge variant="secondary" className="bg-white/80 hover:bg-white/90">
              Proprietário
            </Badge>
          )} */}
          <Badge variant="secondary" className="bg-white/80 hover:bg-white/90">
            {workspace.role === "ADMIN" ? "Admin" : "Membro"}
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
          <div>
            <span>{workspace.projectCount} projetos</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/workspaces/${workspace.slug}`}>
            <Users className="mr-2 h-4 w-4" />
            Membros
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
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
