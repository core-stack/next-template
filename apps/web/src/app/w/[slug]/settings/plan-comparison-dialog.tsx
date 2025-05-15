"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, HelpCircle, Minus } from "lucide-react";

interface PlanComparisonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: string
  onUpgrade: (plan: string) => void
}

export function PlanComparisonDialog({ open, onOpenChange, currentPlan, onUpgrade }: PlanComparisonDialogProps) {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "R$ 0",
      description: "Para pequenos times e projetos pessoais",
      features: {
        members: { value: "10 membros", highlight: false },
        storage: { value: "5 GB", highlight: false },
        projects: { value: "20 projetos", highlight: false },
        apiCalls: { value: "10.000 / mês", highlight: false },
        credits: { value: "500 créditos", highlight: false },
        support: { value: "Email", highlight: false },
        customDomain: { value: false, highlight: false },
        sso: { value: false, highlight: false },
        audit: { value: false, highlight: false },
        sla: { value: false, highlight: false },
      },
    },
    {
      id: "pro",
      name: "Pro",
      price: "R$ 29",
      description: "Para times em crescimento e empresas",
      popular: true,
      features: {
        members: { value: "50 membros", highlight: true },
        storage: { value: "50 GB", highlight: true },
        projects: { value: "100 projetos", highlight: true },
        apiCalls: { value: "100.000 / mês", highlight: true },
        credits: { value: "5.000 créditos", highlight: true },
        support: { value: "Prioritário", highlight: true },
        customDomain: { value: true, highlight: true },
        sso: { value: false, highlight: false },
        audit: { value: "Básico", highlight: true },
        sla: { value: "99.5%", highlight: true },
      },
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "R$ 99",
      description: "Para grandes empresas com necessidades específicas",
      features: {
        members: { value: "Ilimitado", highlight: true },
        storage: { value: "1 TB", highlight: true },
        projects: { value: "Ilimitado", highlight: true },
        apiCalls: { value: "Ilimitado", highlight: true },
        credits: { value: "50.000 créditos", highlight: true },
        support: { value: "Dedicado 24/7", highlight: true },
        customDomain: { value: true, highlight: true },
        sso: { value: true, highlight: true },
        audit: { value: "Avançado", highlight: true },
        sla: { value: "99.9%", highlight: true },
      },
    },
  ]

  // Função para renderizar o valor de uma feature
  const renderFeatureValue = (value: string | boolean, highlight: boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className={cn("h-5 w-5", highlight ? "text-primary" : "text-muted-foreground")} />
      ) : (
        <Minus className="h-5 w-5 text-muted-foreground" />
      )
    }
    return <span className={cn(highlight ? "font-medium" : "")}>{value}</span>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Comparação de Planos</DialogTitle>
          <DialogDescription>
            Compare os recursos e limites disponíveis em cada plano para escolher o melhor para sua organização.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b"></th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-left p-4 border-b min-w-[180px]">
                    <div className="relative">
                      {plan.popular && (
                        <Badge className="absolute -top-8 left-0" variant="default">
                          Popular
                        </Badge>
                      )}
                      <div className="font-bold text-lg">{plan.name}</div>
                      <div className="text-2xl font-bold my-1">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                      {currentPlan === plan.id ? (
                        <Badge variant="outline" className="mt-2">
                          Plano Atual
                        </Badge>
                      ) : (
                        <Button
                          variant={plan.popular ? "default" : "outline"}
                          className="mt-2 w-full"
                          onClick={() => onUpgrade(plan.id)}
                        >
                          {plan.id === "free" ? "Downgrade" : "Upgrade"}
                        </Button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="p-4 border-b">
                  <div className="font-semibold">Limites e Recursos</div>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Membros</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Número máximo de usuários que podem ser adicionados ao workspace.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.members.value, plan.features.members.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Armazenamento</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Espaço total disponível para armazenar arquivos e dados.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.storage.value, plan.features.storage.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Projetos</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Número máximo de projetos que podem ser criados.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.projects.value, plan.features.projects.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Chamadas de API</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Número máximo de requisições à API por mês.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.apiCalls.value, plan.features.apiCalls.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Créditos</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Créditos mensais para uso em recursos avançados.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.credits.value, plan.features.credits.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td colSpan={4} className="p-4 border-b">
                  <div className="font-semibold">Recursos Avançados</div>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Suporte</span>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.support.value, plan.features.support.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Domínio Personalizado</span>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.customDomain.value, plan.features.customDomain.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>SSO / SAML</span>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.sso.value, plan.features.sso.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>Logs de Auditoria</span>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.audit.value, plan.features.audit.highlight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <span>SLA</span>
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 border-b">
                    {renderFeatureValue(plan.features.sla.value, plan.features.sla.highlight)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Precisa de um plano personalizado? Entre em contato com nossa{" "}
            <a href="/sales" className="text-primary hover:underline">
              equipe de vendas
            </a>
            .
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
