"use client"

import { Building, Calendar, Check, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc/client';
import { InviteWithWorkspaceSchema } from '@/lib/trpc/schema/invite';

interface InviteAcceptanceProps {
  invite: InviteWithWorkspaceSchema
}

export function InviteAcceptance({ invite }: InviteAcceptanceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected" | "error">("pending")
  const router = useRouter()
  const { mutateAsync: acceptInvite } = trpc.invite.accept.useMutation()
  const { mutateAsync: rejectInvite } = trpc.invite.reject.useMutation()
  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await acceptInvite({ id: invite.id })
      setStatus("accepted")
      toast({
        title: "Convite aceito",
        description: `Você agora é membro do workspace ${invite.workspace.name}`,
      })

      setTimeout(() => {
        router.push(`/w/${invite.workspace.slug}`)
      }, 2000)
    } catch (error) {
      console.error("Erro ao aceitar convite:", error)
      setStatus("error")
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao aceitar o convite. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      await rejectInvite({ id: invite.id })

      setStatus("rejected")
      toast({
        title: "Convite rejeitado",
        description: "Você rejeitou o convite para o workspace",
      })

      setTimeout(() => {
        router.push(`/w`)
      }, 2000);
    } catch (error) {
      console.error("Erro ao rejeitar convite:", error)
      setStatus("error")
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao rejeitar o convite. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isExpired = new Date() > invite.expiresAt;

  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Building className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Convite para Workspace</CardTitle>
        <CardDescription>
          Você foi convidado para participar do workspace <strong>{invite.workspace.name}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>Workspace:</span>
            </div>
            <span className="font-medium">{invite.workspace.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Função:</span>
            </div>
            <Badge variant="outline">{invite.role === "WORKSPACE_ADMIN" ? "Administrador" : "Membro"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Expira em:</span>
            </div>
            <span className={`text-sm ${isExpired ? "text-destructive" : ""}`}>
              {isExpired ? "Expirado" : formatExpirationDate(invite.expiresAt)}
            </span>
          </div>
        </div>

        {status === "accepted" && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 flex items-center gap-3 text-green-600 dark:text-green-400">
            <Check className="h-5 w-5" />
            <p>Convite aceito com sucesso! Redirecionando...</p>
          </div>
        )}

        {status === "rejected" && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-4 flex items-center gap-3 text-amber-600 dark:text-amber-400">
            <X className="h-5 w-5" />
            <p>Convite rejeitado. Redirecionando...</p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 flex items-center gap-3 text-red-600 dark:text-red-400">
            <X className="h-5 w-5" />
            <p>Ocorreu um erro ao processar o convite. Tente novamente.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {status === "pending" && !isExpired && (
          <>
            <Button variant="outline" className="flex-1" onClick={handleReject} disabled={isLoading} isLoading={isLoading}>
              <X className="mr-2 h-4 w-4" />
              Recusar
            </Button>
            <Button className="flex-1" onClick={handleAccept} disabled={isLoading} isLoading={isLoading}>
              <Check className="mr-2 h-4 w-4" />
              Aceitar
            </Button>
          </>
        )}

        {(status !== "pending" || isExpired) && (
          <Button className="w-full" onClick={() => router.push("/workspaces")}>
            Ir para Workspaces
          </Button>
        )}

        {isExpired && status === "pending" && (
          <div className="w-full text-center text-destructive text-sm">
            Este convite expirou e não pode mais ser aceito.
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
