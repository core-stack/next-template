import { Separator } from "@/components/ui/separator";
import { fetchApi } from "@/lib/fetcher";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

import { DangerZone } from "./components/danger-zone";
import { PricingPlans } from "./components/pricing-plans";
import { TenantSettingsForm } from "./components/tenant-settings-form";

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TenantSettingsPage({ params }: Props) {
  const t = useTranslations();
  const { slug } = await params;
  const { data: tenant } = await fetchApi("[GET] /api/tenant/:slug", { params: { slug } });
  if (!tenant) redirect("/t");

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t/*i18n*/("Settings")}</h1>
          <p className="text-muted-foreground mt-1">{t/*i18n*/("Manage your settings")}</p>
        </div>
        <Separator />
        <TenantSettingsForm
          tenant={tenant}
        />

        <div className="mt-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t/*i18n*/("Pricing")}</h2>
          <PricingPlans currentPlan={"Pro"} />
        </div>

        <div className="mt-6">
          <DangerZone workspaceName={tenant.name} />
        </div>
      </div>
    </div>
  )
}