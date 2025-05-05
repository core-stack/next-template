import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "./form";

import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Login",
  description: "Faça login na sua conta",
}

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-foreground" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <span>SaaS Template</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Esta plataforma transformou a maneira como gerenciamos nossos projetos. A interface intuitiva e as
              funcionalidades avançadas tornaram nosso trabalho muito mais eficiente."
            </p>
            <footer className="text-sm">Sofia Oliveira, CEO da TechSolutions</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-muted-foreground">Entre com seu email e senha para acessar sua conta</p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
