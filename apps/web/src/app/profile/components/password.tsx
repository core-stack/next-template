"use client"
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormPassword } from '@/components/form/password';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdatePasswordSchema, updatePasswordSchema } from '@packages/schemas';

type Props = {
  hasPassword: boolean;
}
export const UpdatePassword = ({ hasPassword }: Props) => {
  const t = useTranslations();
  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { toast } = useToast();
  const isDirty = form.formState.isDirty;
  const isLoading = form.formState.isSubmitting;
  const { mutate } = useApiMutation("[PUT] /api/user/update-password");
  const onSubmit = form.handleSubmit(data => {
    mutate({ body: data }, {
      onSuccess: () => {
        form.reset()
        toast({ title: "Senha atualizada com sucesso" })
      },
      onError: ({ message }) => toast({ title: "Erro ao atualizar senha", variant: "destructive", description: message })
    })
  });

  const reset = () => form.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
      </CardHeader>
      <CardContent>  
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {
              hasPassword &&
              <FormPassword name='currentPassword' label={t/*i18n*/("Current password")} />
            }
            <FormPassword name='newPassword' label={t/*i18n*/("New password")} />
            <FormPassword name='confirmPassword' label={t/*i18n*/("Confirm password")} />

            <CardFooter className="flex justify-end gap-2">
              {
                isDirty &&
                <Button variant="destructive-outline" type="reset" disabled={isLoading} onClick={reset}>
                  Cancelar
                </Button>
              }
              <Button type="submit"disabled={isLoading || !isDirty}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}