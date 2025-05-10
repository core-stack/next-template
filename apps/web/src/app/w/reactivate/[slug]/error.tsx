'use client';
 
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkspacesHeader } from '@/components/workspace/workspace-header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <>
      <WorkspacesHeader />
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.push("/w")} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Workspaces
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Erro ao reativar workspace</CardTitle>
                <CardDescription>
                  Ocorreu um erro ao reativar o workspace. Por favor, tente novamente mais tarde.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="destructive" className="border-amber-500 bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-500">Erro</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Precisa de ajuda? Entre em contato com nosso{" "}
                <a href="/support" className="text-primary hover:underline">
                  suporte
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}