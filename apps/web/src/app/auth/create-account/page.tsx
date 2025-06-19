import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { CreateAccountForm } from './form';

import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta para acessar a plataforma",
}

export default function CreateAccountPage() {
  const t = useTranslations()
  
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center flex lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t/*i18n*/("Create an account")}</h1>
            <p className="text-sm text-muted-foreground">{t/*i18n*/("Create your account to access the platform")}</p>
          </div>
          <CreateAccountForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t/*i18n*/("By continuing, you agree to our")} {" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              {t/*i18n*/("Terms of Service")}
            </Link>{" "}
            {t/*i18n*/("and")}{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              {t/*i18n*/("Privacy Policy")}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
