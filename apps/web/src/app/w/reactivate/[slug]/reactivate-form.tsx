"use client"

import { AlertTriangle, ArrowLeft, Building, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { WorkspaceSchema } from '@/lib/trpc/schema/workspace';

interface ReactivateWorkspaceFormProps {
  workspace: WorkspaceSchema
}

export function ReactivateWorkspaceForm({ workspace }: ReactivateWorkspaceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isReactivated, setIsReactivated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const scheduledForDeletionAt = workspace.disabledAt!.getTime() + 90 * 24 * 60 * 60 * 1000 // 90 dias
  const daysRemaining = Math.ceil((scheduledForDeletionAt - Date.now()) / (1000 * 60 * 60 * 24))

  const deletionProgress = Math.min(
    100,
    Math.max(
      0,
      ((Date.now() - workspace.disabledAt!.getTime()) /
        (scheduledForDeletionAt - workspace.disabledAt!.getTime())) *
        100,
    ),
  )

  const handleReactivate = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsReactivated(true)
      toast({
        title: "Workspace reativado",
        description: `O workspace "${workspace.name}" foi reativado com sucesso.`,
      })

      setTimeout(() => {
        router.push(`/workspaces/${workspace.slug}`)
      }, 2000)
    } catch (error) {
      console.error("Erro ao reativar workspace:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao reativar o workspace. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/workspaces")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Workspaces
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-6 w-6 text-muted-foreground" />
            <CardTitle>{workspace.name}</CardTitle>
          </div>
          <CardDescription>
            Este workspace foi marcado para exclusão e será permanentemente removido em {daysRemaining} dias.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="border-amber-500 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Atenção</AlertTitle>
            <AlertDescription>
              Este workspace será excluído permanentemente em {formatDate(new Date(scheduledForDeletionAt))}. Após essa
              data, não será possível recuperar os dados.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso de exclusão</span>
              <span className="font-medium">{Math.round(deletionProgress)}%</span>
            </div>
            <Progress value={deletionProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Marcado para exclusão: {formatDate(workspace.disabledAt!)}</span>
              <span>Exclusão permanente: {formatDate(new Date(scheduledForDeletionAt))}</span>
            </div>
          </div>

          {isReactivated && (
            <Alert className="border-green-500 bg-green-500/10">
              <RefreshCw className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Workspace reativado</AlertTitle>
              <AlertDescription>
                O workspace foi reativado com sucesso. Você será redirecionado em instantes...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleReactivate} disabled={isLoading || isReactivated} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isReactivated ? "Reativado com sucesso" : "Reativar Workspace"}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Precisa de ajuda? Entre em contato com nosso{" "}
          <a href="/support" className="text-primary hover:underline">
            suporte
          </a>
          .
        </p>
      </div>
    </div>
  )
}
