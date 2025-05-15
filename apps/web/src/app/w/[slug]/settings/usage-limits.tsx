"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Clock, Database, Download, FileText, HelpCircle, Info, Users, Zap } from "lucide-react";
import { useState } from "react";

import { PlanComparisonDialog } from "./plan-comparison-dialog";

interface UsageLimitsProps {
  workspaceId: string
  plan: "free" | "pro" | "enterprise"
}

export function UsageLimits({ workspaceId, plan }: UsageLimitsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isPlanComparisonOpen, setIsPlanComparisonOpen] = useState(false)

  // Dados de exemplo - em produção, estes viriam do backend
  const usageData = {
    members: {
      used: 8,
      limit: plan === "free" ? 10 : plan === "pro" ? 50 : 1000,
      percentage: 0, // Será calculado
    },
    storage: {
      used: 2.7, // GB
      limit: plan === "free" ? 5 : plan === "pro" ? 50 : 1000,
      percentage: 0, // Será calculado
    },
    projects: {
      used: 12,
      limit: plan === "free" ? 20 : plan === "pro" ? 100 : "Ilimitado",
      percentage: 0, // Será calculado
    },
    apiCalls: {
      used: 8500,
      limit: plan === "free" ? 10000 : plan === "pro" ? 100000 : "Ilimitado",
      percentage: 0, // Será calculado
    },
    credits: {
      used: 350,
      limit: plan === "free" ? 500 : plan === "pro" ? 5000 : 50000,
      percentage: 0, // Será calculado
    },
    history: [
      { date: "2023-10-01", credits: 120 },
      { date: "2023-11-01", credits: 180 },
      { date: "2023-12-01", credits: 350 },
    ],
  }

  // Calcular percentagens
  usageData.members.percentage =
    typeof usageData.members.limit === "number"
      ? Math.min(100, (usageData.members.used / usageData.members.limit) * 100)
      : 0

  usageData.storage.percentage =
    typeof usageData.storage.limit === "number"
      ? Math.min(100, (usageData.storage.used / usageData.storage.limit) * 100)
      : 0

  usageData.projects.percentage =
    typeof usageData.projects.limit === "number"
      ? Math.min(100, (usageData.projects.used / usageData.projects.limit) * 100)
      : 0

  usageData.apiCalls.percentage =
    typeof usageData.apiCalls.limit === "number"
      ? Math.min(100, (usageData.apiCalls.used / usageData.apiCalls.limit) * 100)
      : 0

  usageData.credits.percentage =
    typeof usageData.credits.limit === "number"
      ? Math.min(100, (usageData.credits.used / usageData.credits.limit) * 100)
      : 0

  // Função para formatar números grandes
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Função para lidar com o upgrade de plano
  const handleUpgrade = (newPlan: string) => {
    // Em produção, você implementaria a lógica para iniciar o processo de upgrade
    console.log(`Iniciando upgrade para o plano: ${newPlan}`)
    toast({
      title: "Solicitação de upgrade enviada",
      description: `Sua solicitação para upgrade para o plano ${newPlan.toUpperCase()} foi recebida.`,
    })
    setIsPlanComparisonOpen(false)
  }

  // Função para determinar a cor da barra de progresso
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive"
    if (percentage >= 75) return "bg-amber-500"
    return "bg-primary"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Limites e Uso</CardTitle>
            <CardDescription>
              Monitore o uso e os limites do seu workspace no plano{" "}
              <Badge variant="outline" className="font-semibold capitalize">
                {plan}
              </Badge>
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Esta seção mostra o uso atual e os limites disponíveis para seu workspace. Faça upgrade para aumentar
                  os limites.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="credits">Créditos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Membros */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Membros</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {usageData.members.used} / {usageData.members.limit}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Número máximo de membros que podem ser adicionados ao workspace.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Progress
                value={usageData.members.percentage}
                className="h-2"
                indicatorClassName={getProgressColor(usageData.members.percentage)}
              />
            </div>

            {/* Armazenamento */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Armazenamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {usageData.storage.used} GB / {usageData.storage.limit} GB
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Espaço de armazenamento total disponível para arquivos e dados.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Progress
                value={usageData.storage.percentage}
                className="h-2"
                indicatorClassName={getProgressColor(usageData.storage.percentage)}
              />
            </div>

            {/* Projetos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Projetos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {usageData.projects.used} / {usageData.projects.limit}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Número máximo de projetos que podem ser criados no workspace.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {typeof usageData.projects.limit === "number" ? (
                <Progress
                  value={usageData.projects.percentage}
                  className="h-2"
                  indicatorClassName={getProgressColor(usageData.projects.percentage)}
                />
              ) : (
                <div className="text-xs text-muted-foreground">Ilimitado no plano atual</div>
              )}
            </div>

            {/* API Calls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Chamadas de API</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {formatNumber(usageData.apiCalls.used)} / {formatNumber(usageData.apiCalls.limit)}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Número máximo de chamadas de API por mês.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {typeof usageData.apiCalls.limit === "number" ? (
                <Progress
                  value={usageData.apiCalls.percentage}
                  className="h-2"
                  indicatorClassName={getProgressColor(usageData.apiCalls.percentage)}
                />
              ) : (
                <div className="text-xs text-muted-foreground">Ilimitado no plano atual</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Créditos Disponíveis</h3>
                </div>
                <Badge variant="outline" className="text-lg font-semibold">
                  {usageData.credits.used} / {usageData.credits.limit}
                </Badge>
              </div>
              <Progress
                value={usageData.credits.percentage}
                className="h-3 mb-4"
                indicatorClassName={getProgressColor(usageData.credits.percentage)}
              />
              <div className="text-sm text-muted-foreground mb-4">
                Seus créditos são renovados mensalmente. Os créditos não utilizados não são acumulados para o próximo
                período.
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Relatório de Uso
                </Button>
                <Button size="sm">Comprar Créditos Adicionais</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Como os créditos são usados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="font-medium mb-1">Processamento de Dados</div>
                  <div className="text-sm text-muted-foreground">1 crédito por GB processado</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-medium mb-1">Armazenamento</div>
                  <div className="text-sm text-muted-foreground">5 créditos por GB/mês</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-medium mb-1">Chamadas de API</div>
                  <div className="text-sm text-muted-foreground">0.1 crédito por 1000 chamadas</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-medium mb-1">Funções Avançadas</div>
                  <div className="text-sm text-muted-foreground">Varia conforme a função</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Período</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Créditos Usados</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Limite</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usageData.history.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3 text-sm">
                        {new Date(item.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-sm">{item.credits}</td>
                      <td className="px-4 py-3 text-sm">{usageData.credits.limit}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={item.credits > usageData.credits.limit * 0.9 ? "destructive" : "outline"}>
                          {item.credits > usageData.credits.limit * 0.9 ? "Próximo do limite" : "Normal"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar Histórico Completo
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Precisa de mais recursos? Faça upgrade para um plano superior.
            </div>
            <Button onClick={() => setIsPlanComparisonOpen(true)}>Comparar Planos</Button>
          </div>
        </div>
      </CardContent>
      <PlanComparisonDialog
        open={isPlanComparisonOpen}
        onOpenChange={setIsPlanComparisonOpen}
        currentPlan={plan}
        onUpgrade={handleUpgrade}
      />
    </Card>
  )
}
