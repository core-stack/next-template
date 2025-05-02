"use client"

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DangerZoneProps {
  workspaceId: string
  workspaceName: string
}

export function DangerZone({ workspaceId, workspaceName }: DangerZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteWorkspace = async () => {
    setIsLoading(true)
    try {
      console.log(`Excluindo workspace: ${workspaceId}`)
      // Aqui você implementaria a lógica para excluir o workspace
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsDeleteDialogOpen(false)
      // Redirecionar para a lista de workspaces após a exclusão
      window.location.href = "/workspaces"
    } catch (error) {
      console.error("Erro ao excluir workspace:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isDeleteButtonDisabled = confirmText !== workspaceName || isLoading

  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis que podem afetar permanentemente sua organização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-medium">Excluir esta organização</h3>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. Todos os dados, projetos e membros serão removidos permanentemente.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Excluir organização
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir organização</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a organização{" "}
              <span className="font-semibold">{workspaceName}</span> e removerá todos os dados associados.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>
              Todos os projetos, arquivos e dados serão excluídos permanentemente e não poderão ser recuperados.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 py-2">
            <Label htmlFor="confirm">
              Digite <span className="font-semibold">{workspaceName}</span> para confirmar:
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={workspaceName}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorkspace} disabled={isDeleteButtonDisabled}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
