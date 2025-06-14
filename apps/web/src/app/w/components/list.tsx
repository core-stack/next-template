"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogType } from "@/dialogs";
import { useDialog } from "@/hooks/use-dialog";
import { RouterOutput } from "@/lib/trpc/app.router";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { ArrayElement } from "@/types/array";
import { ArrowBigRight, Building, Settings, Users } from "lucide-react";
import Link from "next/link";

export function WorkspaceList() {
  const { data: workspaces = [] } = trpc.workspace.get.useQuery();
  const { data: user } = trpc.user.self.useQuery();
  const { openDialog } = useDialog();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onEdit={() => openDialog({ type: DialogType.UPDATE_WORKSPACE, props: { workspace } })}
            role={user?.members.find((m) => m.workspaceId === workspace.id)?.role.name}
            owner={user?.members.find((m) => m.workspaceId === workspace.id)?.owner}
          />
        ))}
        <CreateWorkspaceCard onClick={() => openDialog({ type: DialogType.CREATE_WORKSPACE })} />
      </div>
    </>
  )
}

type WorkspaceCardProps = {
  workspace: ArrayElement<RouterOutput["workspace"]["get"]>;
  onEdit: (workspace: ArrayElement<RouterOutput["workspace"]["get"]>) => void;
  role?: string;
  owner?: boolean;
}
function WorkspaceCard({ workspace, onEdit, role, owner }: WorkspaceCardProps) {
  const cardStyle = { background: workspace.backgroundImage };

  return (
    <Card className={cn("overflow-hidden border-2 hover:border-primary/50 transition-all", workspace.disabledAt && "opacity-50")}>
      <div className="h-32 w-full relative" style={cardStyle}>
        <div className="absolute top-2 right-2 flex gap-2">
          {
            owner &&
            <Badge variant="secondary" className="bg-green-300 hover:bg-green-400 text-black">
              Proprietario
            </Badge>
          }
          <Badge variant="secondary" className="bg-yellow-300 hover:bg-yellow-400 text-black">
            {role}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5 text-muted-foreground" />
          {workspace.name} {workspace.disabledAt && <Badge className="ml-2" variant="destructive">Desativado</Badge>}
        </CardTitle>
        <CardDescription className='truncate'>{workspace.description || "Sem descrição"}</CardDescription>
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
        <Button variant="outline" size="sm" disabled={!!workspace.disabledAt} asChild>
          <Link href={workspace.disabledAt ? `/w/reactivate/${workspace.slug}` : `/w/${workspace.slug}`}>
            <ArrowBigRight className="mr-2 h-4 w-4" />
            {workspace.disabledAt ? "Reativar" : "Entrar"}
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!!workspace.disabledAt}
          onClick={() => onEdit(workspace)}
        >
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
