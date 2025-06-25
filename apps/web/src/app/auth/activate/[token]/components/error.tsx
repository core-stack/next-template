"use client";
import { XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const ActivationError = ({ error }: { error: string }) => {
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
        <>
          <Link href="/login">{t/*i18n*/("Back to Login")}</Link>
        </>
      </Button>
    </div>
  )
}
