"use client"

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';

import { ConfirmDeleteDialog } from './confirm-delete-dialog';

interface DangerZoneProps {
  workspaceName: string
}

export function DangerZone({ workspaceName }: DangerZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis que podem afetar permanentemente seu workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-medium">Excluir este workspace</h3>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. Todos os dados serão removidos permanentemente.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Excluir
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        workspaceName={workspaceName}
      />
    </>
  )
}
