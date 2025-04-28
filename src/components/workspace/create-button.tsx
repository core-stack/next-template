"use client"

import { Building } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { WorkspaceDialog } from './dialog';

export function CreateWorkspaceButton() {
  const [open, setOpen] = useState(false)

  const handleSave = (workspaceData: any) => {
    console.log("Criar workspace:", workspaceData)
    setOpen(false)
    // Aqui você implementaria a lógica para criar o workspace
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Building className="mr-2 h-4 w-4" />
        Nova Organização
      </Button>
      <WorkspaceDialog open={open} onOpenChange={setOpen} onSave={handleSave} />
    </>
  )
}
