"use client"

import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { useState } from "react";

import { WorkspaceDialog } from "./dialog";

export function CreateWorkspaceButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Building className="mr-2 h-4 w-4" />
        Nova Organização
      </Button>
      <WorkspaceDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
