"use client"

import { Button } from "@/components/ui/button";
import { DialogType } from "@/dialogs";
import { useDialog } from "@/hooks/use-dialog";
import { Building } from "lucide-react";

export function CreateWorkspaceButton() {
  const { openDialog } = useDialog();

  return (
    <>
      <Button onClick={() => openDialog({ type: DialogType.CREATE_WORKSPACE })}>
        <Building className="mr-2 h-4 w-4" />
        Novo Workspace
      </Button>
    </>
  )
}
