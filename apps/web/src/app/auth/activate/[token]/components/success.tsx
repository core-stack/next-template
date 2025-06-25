"use client";
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const ActivationSuccess = () => {
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
        <>
          <Link href="/login" className="flex items-center">
            {t/*i18n*/("Continue to Login")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </>
      </Button>
    </div>
  )
}