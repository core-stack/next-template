"use client"

import { AlertTriangle, ArrowLeft, Building, Loader2, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ApiTenantSlugGet } from '@packages/common';

interface ReactivateTenantFormProps {
  tenant: ApiTenantSlugGet.Response200
}

export function ReactivateTenantForm({ tenant }: ReactivateTenantFormProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isReactivated, setIsReactivated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const scheduledForDeletionAt = tenant.disabledAt!.getTime() + 90 * 24 * 60 * 60 * 1000; // 90 days
  const daysRemaining = Math.ceil((scheduledForDeletionAt - Date.now()) / (1000 * 60 * 60 * 24));

  const deletionProgress = Math.min(
    100,
    Math.max(
      0,
      ((Date.now() - tenant.disabledAt!.getTime()) /
        (scheduledForDeletionAt - tenant.disabledAt!.getTime())) *
        100,
    ),
  );

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsReactivated(true);
      toast({
        title: t/*i18n*/("Tenant reactivated"),
        description: t/*i18n*/("The tenant \"{name}\" was successfully reactivated", { name: tenant.name }),
      });

      setTimeout(() => {
        router.push(`/tenants/${tenant.slug}`);
      }, 2000);
    } catch (error) {
      console.error("Error reactivating tenant:", error);
      toast({
        title: t/*i18n*/("Error"),
        description: t/*i18n*/("An error occurred while reactivating the tenant, please try again"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/t")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t/*i18n*/("Back to Tenants")}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-6 w-6 text-muted-foreground" />
            <CardTitle>{tenant.name}</CardTitle>
          </div>
          <CardDescription>
            {t/*i18n*/("This tenant has been scheduled for deletion and will be permanently removed in {days} days", { days: daysRemaining })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="border-amber-500 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">{t/*i18n*/("Attention")}</AlertTitle>
            <AlertDescription>
              {t/*i18n*/("This tenant will be permanently deleted on {date}", { date: formatDate(new Date(scheduledForDeletionAt)) })}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t/*i18n*/("Deletion progress")}</span>
              <span className="font-medium">{Math.round(deletionProgress)}%</span>
            </div>
            <Progress value={deletionProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t/*i18n*/("Marked for deletion: {date}", { date: formatDate(tenant.disabledAt!) })}</span>
              <span>{t/*i18n*/("Permanent deletion: {date}", { date: formatDate(new Date(scheduledForDeletionAt)) })}</span>
            </div>
          </div>

          {isReactivated && (
            <Alert className="border-green-500 bg-green-500/10">
              <RefreshCw className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">{t/*i18n*/("Tenant reactivated")}</AlertTitle>
              <AlertDescription>
                {t/*i18n*/("The tenant was successfully reactivated")}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleReactivate} disabled={isLoading || isReactivated} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isReactivated ? t/*i18n*/("Reactivated successfully") : t/*i18n*/("Reactivate Tenant")}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          {t/*i18n*/("Need help? Contact our")}{' '}
          <a href="/support" className="text-primary hover:underline">
            {t/*i18n*/("support")}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
