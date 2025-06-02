export type Plan = {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  limits: {
    members: number;
  };
  popular?: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      members: 5,
    },
    features: ["Até 3 projetos", "Até 5 membros por workspace", "1GB de armazenamento", "Suporte por email"],
  },
  {
    id: "pro",
    name: "Profissional",
    price: {
      monthly: 29,
      yearly: 299,
    },
    limits: {
      members: 10,
    },
    features: ["Até 5 projetos", "Até 10 membros por workspace", "5GB de armazenamento", "Suporte por email", "Suporte por telefone"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Empresa",
    price: {
      monthly: 59,
      yearly: 599,
    },
    limits: {
      members: 20,
    },
    features: ["Até 10 projetos", "Até 20 membros por workspace", "10GB de armazenamento", "Suporte prioritário", "Recursos avançados de colaboração", "Integrações com ferramentas externas"],
  },
] as const;

export const getLimits = (planId: string) => {
  const plan = PLANS.find((plan) => plan.id === planId);
  return plan?.limits;
};
