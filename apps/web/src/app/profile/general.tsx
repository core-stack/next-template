"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelfUserSchema, updateProfileSchema, UpdateUserNameSchema } from "@/lib/trpc/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  user: SelfUserSchema;
}
export const General = ({ user }: Props) => {
  const profileForm = useForm<UpdateUserNameSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
    },
  });
  const isLoading = profileForm.formState.isSubmitting;
  const onSubmit = profileForm.handleSubmit(data => {

  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Gerais</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais. Estas informações serão exibidas publicamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="text-2xl">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              Alterar foto
            </Button>
          </div>
        </div>

        <Form {...profileForm}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={profileForm.control}
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
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="nome@exemplo.com"
                        type="email"
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
      </CardContent>
    </Card>
  );
}