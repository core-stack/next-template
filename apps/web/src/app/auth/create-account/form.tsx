"use client"

import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc/client';
import { createAccountSchema, CreateAccountSchema } from '@/lib/trpc/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';

export function CreateAccountForm() {
  const { toast } = useToast();
  const form = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const isLoading = form.formState.isSubmitting;
  const { mutate } = trpc.auth.createAccount.useMutation();
  const onSubmit = form.handleSubmit(async (data) => {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Conta criada com sucesso",
          description: "Um email de ativação foi enviado para você. Por favor, verifique sua caixa de entrada.",
        })
      },
      onError: (error) => {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        })
      }
    });
  })

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nome@exemplo.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" disabled={isLoading} {...field} />
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
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Criar conta
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" isLoading={isLoading}>
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" type="button" isLoading={isLoading}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          Entrar
        </Link>
      </div>
    </div>
  )
}
