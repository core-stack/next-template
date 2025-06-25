import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchApi } from '@/lib/fetcher';

import { ActivationError } from './components/error';
import { ActivationSuccess } from './components/success';

type ActivateAccountPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ActivateAccountPage({ params }: ActivateAccountPageProps) {
  const t = await getTranslations();
  const { token } = await params;
  let errorMessage: string | undefined = !!token ? undefined : t/*i18n*/("Invalid activation code");
  if (!errorMessage) {
    const res = await fetchApi("[POST] /api/auth/active-account", { body: { token } });
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
            <div>
              {errorMessage ? <ActivationError error={errorMessage} /> : <ActivationSuccess />}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}