"use client";

import { Building, Calendar, Check, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from '@/hooks/use-toast';
import { ApiInviteIdGet } from '@packages/common';

type InviteAcceptanceProps = {
  invite: ApiInviteIdGet.Response200
}

export function InviteAcceptance({ invite }: InviteAcceptanceProps) {
  const t = useTranslations();
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected" | "error">("pending");
  const router = useRouter();

  const { mutate: acceptInvite, isPending: isAcceptLoading } = useApiMutation("[POST] /api/invite/:id/accept");
  const handleAccept = async () => {
    acceptInvite({ params: { id: invite.id } }, {
      onSuccess: () => {
        setStatus("accepted");
        toast({
          title: t/*i18n*/("Invite accepted"),
          description: `${t/*i18n*/("Now you are a member of")}  ${invite.tenant.name}`,
        });
  
        setTimeout(() => {
          router.push(`/t/${invite.tenant.slug}`);
        }, 2000);
      }, 
      onError: () => {
        setStatus("error");
        toast({
          title: t/*i18n*/("Error"),
          description: t/*i18n*/("An error occurred while accepting the invite, please try again"),
          variant: "destructive",
        });
      }
    });
  };

  const { mutate: rejectInvite, isPending: isRejectLoading } = useApiMutation("[POST] /api/invite/:id/reject");
  const handleReject = async () => {
    rejectInvite({ params: { id: invite.id } }, {
      onSuccess: () => {
        setStatus("rejected");
        toast({ title: t/*i18n*/("Invite rejected") });
  
        setTimeout(() => {
          router.push(`/t/${invite.tenant.slug}`);
        }, 2000);
      }, 
      onError: () => {
        setStatus("error");
        toast({
          title: t/*i18n*/("Error"),
          description: t/*i18n*/("An error occurred while rejecting the invite, please try again"),
          variant: "destructive",
        });
      }
    });
  };
  const isLoading = isAcceptLoading || isRejectLoading;
  const isExpired = new Date() > invite.expiresAt;

  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Building className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t/*i18n*/("Tenant Invite")}</CardTitle>
        <CardDescription>
          {t/*i18n*/("You have been invited to")} <strong>{invite.tenant.name}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{t/*i18n*/("Tenant")}:</span>
            </div>
            <span className="font-medium">{invite.tenant.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Função:</span>
            </div>
            <Badge variant="outline">
              {invite.role.name}
            </Badge>
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReject}
              disabled={isLoading}
              isLoading={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Recusar
            </Button>
            <Button
              className="flex-1"
              onClick={handleAccept}
              disabled={isLoading}
              isLoading={isLoading}
            >
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
  );
}
