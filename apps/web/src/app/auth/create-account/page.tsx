import Link from 'next/link';

import { CreateAccountForm } from './form';

import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta para acessar a plataforma",
}

export default function CreateAccountPage() {
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
              "Desde que começamos a usar esta plataforma, nossa produtividade aumentou em 40%. A colaboração entre
              equipes nunca foi tão fácil."
            </p>
            <footer className="text-sm">Rafael Santos, CTO da InnovaTech</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Criar uma conta</h1>
            <p className="text-sm text-muted-foreground">Preencha os campos abaixo para criar sua conta</p>
          </div>
          <CreateAccountForm />
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
