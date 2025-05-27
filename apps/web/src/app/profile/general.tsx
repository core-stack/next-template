"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileImageUploader } from "@/components/user/profile-image-uploader";
import { toast } from "@/hooks/use-toast";
import { RouterOutput } from "@/lib/trpc/app.router";
import { trpc } from "@/lib/trpc/client";
import { UpdateProfileSchema, updateProfileSchema } from "@/lib/trpc/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  user: RouterOutput["user"]["self"];
}
export const General = ({ user }: Props) => {
  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;
  const { mutate } = trpc.user.updateName.useMutation();
  const onSubmit = form.handleSubmit(data => {
    mutate(
      data,
      {
        onSuccess: ({ name }) => {
          form.reset({ name });
          toast({ title: "Nome atualizado com sucesso" });
        },
        onError: ({ message }) => toast({ title: "Erro ao atualizar nome", description: message, variant: "destructive" })
      },
    )
  });

  const reset = () => form.reset({ name: user.name ?? "" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Gerais</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais. Estas informações serão exibidas publicamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileImageUploader user={{ name: user.name, image: user.image }} />

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Seu nome" disabled={isLoading} {...field} />
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
              <Button type="submit" disabled={isLoading || !isDirty}>
                Salvar alterações
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}