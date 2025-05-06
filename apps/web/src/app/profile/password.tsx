"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { trpc } from "@/lib/trpc/client";
import { updatePasswordSchema, UpdatePasswordSchema } from "@/lib/trpc/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

export const UpdatePassword = () => {
  const { data: hasPassword, isLoading: isFetching } = trpc.user.hasPassword.useQuery();
  const passwordForm = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const isLoading = passwordForm.formState.isSubmitting;
  const onSubmit = passwordForm.handleSubmit(data => {

  });
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
          <Form {...passwordForm}>
            <form onSubmit={onSubmit} className="space-y-4">
              {
                hasPassword &&
                <FormField
                  control={passwordForm.control}
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
                control={passwordForm.control}
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
                control={passwordForm.control}
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
              <CardFooter className="flex justify-end">
                <Button type="submit"disabled={isLoading}>
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