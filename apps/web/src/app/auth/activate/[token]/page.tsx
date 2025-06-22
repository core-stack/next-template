import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchApi } from '@/lib/fetcher';

type ActivateAccountPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ActivateAccountPage({ params }: ActivateAccountPageProps) {
  const t = await getTranslations();
  const { token } = await params;
  let errorMessage: string | undefined = !!token ? undefined : t/*i18n*/("Invalid activation code");
  if (!errorMessage) {
    const res = await fetchApi("/api/auth/active-account", { body: { token } });
    if (!res.success) {
      errorMessage = res.error?.message || t/*i18n*/("Invalid activation code");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background/50 to-background">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-border/40 shadow-xl">
          <CardHeader>
            <CardTitle className='text-center'>{t/*i18n*/("Account Activation")}</CardTitle>
            <CardDescription className='text-center'>{t/*i18n*/("We are activating your account")}</CardDescription>
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
  const t = useTranslations();

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
        <h2 className="text-2xl font-semibold text-foreground">{t/*i18n*/("Account Activated!")}</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {t/*i18n*/("Your account was activated successfully") + ". " + t/*i18n*/("Now you can log in to access your account") + "."}
        </p>
      </div>
      <Button asChild size="lg" className="mt-4 px-8 font-medium">
        <Link href="/login" className="flex items-center">
          {t/*i18n*/("Continue to Login")} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

const ActivationError = ({ error }: { error: string }) => {
  const t = useTranslations();

  return (
    <div className="text-center py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="relative">
          <div className="relative rounded-full p-4 bg-destructive/20">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">{t/*i18n*/("Failed to Activate Account")}</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">{error}</p>
      </div>
      <Button asChild variant="outline" size="lg" className="mt-4 px-8 font-medium">
        <Link href="/login">{t/*i18n*/("Back to Login")}</Link>
      </Button>
    </div>
  )
}
