"use client"
import { Loader2, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc/client';
import { updatePasswordSchema, UpdatePasswordSchema } from '@/lib/trpc/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';

export const UpdatePassword = () => {
  const { data: hasPassword, isLoading: isFetching } = trpc.user.hasPassword.useQuery(undefined, { staleTime: Infinity });
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
  const { mutate } = trpc.user.updatePassword.useMutation();
  const onSubmit = form.handleSubmit(data => {
    mutate(data, { 
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
        {
          isFetching &&
          <>
            <Loading variant="skeleton" count={3} />
          </>
        }
        {
          !isFetching &&
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              {
                hasPassword &&
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha atual</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-10"
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          type="password"
                          placeholder="••••••••"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          type="password"
                          placeholder="••••••••"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        }
      </CardContent>
    </Card>
  );
}