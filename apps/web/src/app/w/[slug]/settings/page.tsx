import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator";

import { DangerZone } from "./danger-zone";
import { PricingPlans } from "./pricing-plans";
import { WorkspaceSettingsForm } from "./workspace-settings-form";

export default function WorkspaceSettingsPage() {
  const workspace = {
    id: "1",
    slug: "slug",
    name: `Organização`,
    description: "Área de trabalho compartilhada para sua equipe",
    backgroundImage: "linear-gradient(to right, #4f46e5, #8b5cf6)",
    isOwner: true,
    role: "ADMIN",
    currentPlan: "pro",
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações da Organização</h1>
          <p className="text-muted-foreground mt-1">Gerencie as configurações e preferências da sua organização</p>
        </div>
        <Separator />

        <WorkspaceSettingsForm workspace={workspace} />

        <div className="mt-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Planos e Faturamento</h2>
          <PricingPlans currentPlan={workspace.currentPlan} />
        </div>

        <div className="mt-6">
          <DangerZone workspaceId={workspace.id} workspaceName={workspace.name} />
        </div>
      </div>
    </div>
  )
}
