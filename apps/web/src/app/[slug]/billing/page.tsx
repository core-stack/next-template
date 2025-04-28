import type { Metadata } from "next"
import { CreditCard, Download, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BillingPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BillingPageProps): Promise<Metadata> {
  return {
    title: `Faturamento | Organização ${params.slug}`,
    description: "Gerencie o faturamento da sua organização",
  }
}

export default function BillingPage({ params }: BillingPageProps) {
  const { slug } = params

  // Dados de exemplo - em produção, estes viriam do backend
  const billingInfo = {
    plan: "Free",
    nextBillingDate: "N/A",
    paymentMethod: "N/A",
  }

  const invoices = [
    { id: "INV-001", date: "2023-10-01", amount: "R$ 0,00", status: "Pago" },
    { id: "INV-002", date: "2023-09-01", amount: "R$ 0,00", status: "Pago" },
    { id: "INV-003", date: "2023-08-01", amount: "R$ 0,00", status: "Pago" },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Faturamento</h1>
        <p className="text-muted-foreground">Gerencie o faturamento e assinatura da sua organização</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
            <CardDescription>Detalhes do seu plano atual e próximo faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plano:</span>
                <span className="text-sm">{billingInfo.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Próximo faturamento:</span>
                <span className="text-sm">{billingInfo.nextBillingDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Método de pagamento:</span>
                <span className="text-sm">{billingInfo.paymentMethod}</span>
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Fazer Upgrade para Pro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Método de Pagamento</CardTitle>
            <CardDescription>Gerencie seus métodos de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nenhum método de pagamento</p>
                    <p className="text-xs text-muted-foreground">Adicione um método de pagamento para fazer upgrade</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Adicionar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Faturas</CardTitle>
            <CardDescription>Visualize e baixe suas faturas anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Fatura</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Data</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Valor</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{invoice.id}</td>
                        <td className="p-4 align-middle">{invoice.date}</td>
                        <td className="p-4 align-middle">{invoice.amount}</td>
                        <td className="p-4 align-middle">{invoice.status}</td>
                        <td className="p-4 align-middle text-right">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">Nenhuma fatura disponível</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
