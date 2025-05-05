"use client"

import { CreditCard, LayoutDashboard, Settings, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { UserProfile } from '@/components/user/profile';
import { trpc } from '@/lib/trpc/client';
import { WorkspaceSchema } from '@/lib/trpc/schema/workspace';
import { cn } from '@/lib/utils';

interface WorkspaceSidebarProps {
  slug: string
  currentWokspace: WorkspaceSchema
}

export function WorkspaceSidebar({ slug, currentWokspace }: WorkspaceSidebarProps) {
  const pathname = usePathname() || ""
  const router = useRouter();
  const { data: workspaces = [currentWokspace] } = trpc.workspace.get.useQuery();

  const routes = [
    {
      label: "Visão Geral",
      icon: LayoutDashboard,
      href: `/w/${slug}`,
      active: pathname === `/w/${slug}`,
    },
    {
      label: "Membros",
      icon: Users,
      href: `/w/${slug}/members`,
      active: pathname.includes(`/${slug}/members`),
    },
    {
      label: "Faturamento",
      icon: CreditCard,
      href: `/w/${slug}/billing`,
      active: pathname === `/w/${slug}/billing`,
    },
    {
      label: "Configurações",
      icon: Settings,
      href: `/w/${slug}/settings`,
      active: pathname === `/w/${slug}/settings`,
    },
  ]

  const handleWorkspaceChange = (value: string) => {
    router.push(`/w/${value}`)
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen sticky top-0 overflow-y-auto",
         "w-[280px]",
      )}
    >
      <div className="p-4 border-b">
        <Select defaultValue={slug} onValueChange={handleWorkspaceChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um workspace" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Seus workspaces</SelectLabel>
              {workspaces.map((ws) => (
                <SelectItem key={ws.id} value={ws.slug}>
                  {ws.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectItem value="new">
                <span className="flex items-center gap-2">
                  <span className="text-primary">+</span> Criar novo workspace
                </span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                route.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-primary",
              )}
            >
              <route.icon className={cn("h-5 w-5", route.active ? "text-primary" : "text-muted-foreground")} />
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4 py-4">
        {/* Card de Upgrade */}
        <div
          className={cn("rounded-lg bg-gradient-to-r from-primary/80 to-primary p-4 text-white mb-4")}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Upgrade para Pro</span>
          </div>
          <p className="text-xs mb-3">Desbloqueie recursos avançados e remova limites com nosso plano Pro.</p>
          <Button size="sm" variant="secondary" className="w-full">
            Fazer Upgrade
          </Button>
        </div>

        <UserProfile />
      </div>
    </div>
  )
}
