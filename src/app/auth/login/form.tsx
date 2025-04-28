"use client"

import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    // Simulando uma chamada de API
    try {
      console.log(data)
      // Aqui você implementaria a lógica de autenticação
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <Link href="/auth/reset-password" className="text-xs text-muted-foreground hover:text-primary">
                    Esqueceu a senha?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Entrar
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
        Não tem uma conta?{" "}
        <Link href="/auth/create-account" className="underline underline-offset-4 hover:text-primary">
          Criar conta
        </Link>
      </div>
    </div>
  )
}
