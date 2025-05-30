"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks/use-dialog";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc/client";
import { DisableWorkspaceSchema, disableWorkspaceSchema } from "@/lib/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { DialogType } from "./";

type Props = {
  workspaceName: string;
}
export const ConfirmDeleteDialog = ({ workspaceName }: Props) => {
  const { slug } = useParams<{ slug: string }>();
  const { closeDialog } = useDialog();
  const { toast } = useToast();
  const form = useForm<DisableWorkspaceSchema>({
    resolver: zodResolver(disableWorkspaceSchema),
    defaultValues: {
      password: "",
      slug,
      confirmText: "",
    }
  });

  const isLoading = form.formState.isSubmitting;
  const { mutate } = trpc.workspace.disable.useMutation();

  const onSubmit = form.handleSubmit(async (data) => {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Workspace excluida com sucesso",
        })
        closeDialog(DialogType.CONFIRM_DELETE_WORKSPACE);
      }
    });
  })

  return (
    <>
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
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="confirmText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digite <span className="font-semibold">{workspaceName}</span> para confirmar:</FormLabel>
                  <FormControl>
                    <Input
                      className="resize-none"
                      {...field}
                      placeholder={workspaceName}
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Uma breve descrição sobre sua organização.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digite sua senha para confirmar:</FormLabel>
                  <FormControl>
                    <Input
                      className="resize-none"
                      type="password"
                      {...field}
                      placeholder="Sua senha"
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Por motivos de segurança, precisamos confirmar sua senha para realizar esta ação.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type='button'
              onClick={() => closeDialog(DialogType.CONFIRM_DELETE_WORKSPACE)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button variant="destructive">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}