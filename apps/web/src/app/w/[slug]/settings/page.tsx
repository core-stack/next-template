import { Separator } from "@/components/ui/separator";
import { caller } from "@/lib/trpc/server";

import { DangerZone } from "./danger-zone";
import { PricingPlans } from "./pricing-plans";
import { WorkspaceSettingsForm } from "./workspace-settings-form";

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function WorkspaceSettingsPage({ params }: Props) {
  const { slug } = await params;
  const workspace = await caller.workspace.getBySlug({ slug });

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações da Organização</h1>
          <p className="text-muted-foreground mt-1">Gerencie as configurações e preferências da sua organização</p>
        </div>
        <Separator />
        <WorkspaceSettingsForm
          workspace={workspace}
        />
        <div className="mt-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Limites e Uso</h2>
          <UsageLimits workspaceId={workspace.id} plan={workspace.currentPlan as "free" | "pro" | "enterprise"} />
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Planos e Faturamento</h2>
          <PricingPlans currentPlan={"Pro"} />
        </div>

        <div className="mt-6">
          <DangerZone workspaceName={workspace.name} />
        </div>
      </div>
    </div>
  )
}