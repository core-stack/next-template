"use client"

import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PricingPlansProps {
  currentPlan: string
}

interface Plan {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    description: "Para pequenos times e projetos pessoais",
    price: 0,
    features: ["Até 3 projetos", "Até 5 membros por workspace", "1GB de armazenamento", "Suporte por email"],
  },
  {
    id: "pro",
    name: "Profissional",
    description: "Para times em crescimento e empresas",
    price: 29,
    features: [
      "Projetos ilimitados",
      "Até 20 membros por workspace",
      "10GB de armazenamento",
      "Suporte prioritário",
      "Recursos avançados de colaboração",
      "Integrações com ferramentas externas",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Empresarial",
    description: "Para grandes empresas com necessidades específicas",
    price: 99,
    features: [
      "Projetos ilimitados",
      "Membros ilimitados",
      "100GB de armazenamento",
      "Suporte dedicado 24/7",
      "Recursos avançados de segurança",
      "Personalização completa",
      "API avançada",
      "Controle de acesso granular",
    ],
  },
]

export function PricingPlans({ currentPlan }: PricingPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePlan = async () => {
    if (selectedPlan === currentPlan) return

    setIsLoading(true)
    try {
      console.log(`Alterando plano de ${currentPlan} para ${selectedPlan}`)
      // Aqui você implementaria a lógica para alterar o plano
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (error) {
      console.error("Erro ao alterar plano:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedPlan}
        onValueChange={setSelectedPlan}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            {plan.popular && (
              <Badge className="absolute -top-2 -right-2 z-10" variant="default">
                Popular
              </Badge>
            )}
            <Label
              htmlFor={`plan-${plan.id}`}
              className={`cursor-pointer h-full ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""}`}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price === 0 ? "Grátis" : `R$${plan.price}`}</span>
                    {plan.price > 0 && <span className="text-muted-foreground ml-1">/mês</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="sr-only" disabled={isLoading} />
                  <div className="w-full text-center">
                    {currentPlan === plan.id ? (
                      <Badge variant="outline" className="w-full py-1">
                        Plano Atual
                      </Badge>
                    ) : (
                      <Button variant="outline" className="w-full" disabled={isLoading}>
                        Selecionar
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedPlan !== currentPlan && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleChangePlan} disabled={isLoading} className="w-full max-w-xs">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Alterar para o plano {plans.find((p) => p.id === selectedPlan)?.name}
          </Button>
        </div>
      )}
    </div>
  )
}
