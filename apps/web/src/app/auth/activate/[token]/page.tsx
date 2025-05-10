import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { publicCaller } from '@/lib/trpc/server';
import { TRPCError } from '@trpc/server';

type ActivateAccountPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ActivateAccountPage({ params }: ActivateAccountPageProps) {
  const { token } = await params;
  let errorMessage: string | undefined = !!token ? undefined : "Token de ativação inválido";
  if (!errorMessage) {
    try {
      await publicCaller.auth.activateAccount({ token });
    } catch (error) {
      if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
        errorMessage = error.message;
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background/50 to-background">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-border/40 shadow-xl">
          <CardHeader>
            <CardTitle className='text-center'>Ativação de Conta</CardTitle>
            <CardDescription className='text-center'>Estamos processando a ativação da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            {errorMessage ? <ActivationError error={errorMessage} /> : <ActivationSuccess />}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

const ActivationSuccess = () => {
  return (
    <div className="text-center py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-ping opacity-75 scale-110"></div>
          <div className="relative rounded-full p-4 bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-500" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Conta Ativada!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Sua conta foi ativada com sucesso. Agora você pode fazer login para acessar sua conta.
        </p>
      </div>
      <Button asChild size="lg" className="mt-4 px-8 font-medium">
        <Link href="/login" className="flex items-center">
          Continuar para Login <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

const ActivationError = ({ error }: { error: string }) => {
  return (
    <div className="text-center py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="relative">
          <div className="relative rounded-full p-4 bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-16 w-16 text-red-600 dark:text-red-500" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Falha na Ativação</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">{error}</p>
      </div>
      <Button asChild variant="outline" size="lg" className="mt-4 px-8 font-medium">
        <Link href="/login">Voltar para Login</Link>
      </Button>
    </div>
  )
}
