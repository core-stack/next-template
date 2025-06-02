"use client"

import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { usePermission } from "@/context/permission";
import { DialogType } from "@/dialogs";
import { useDialog } from "@/hooks/use-dialog";
import { RouterOutput } from "@/lib/trpc/app.router";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Permission } from "@packages/permission";
import { CreditCard, LayoutDashboard, Plus, Settings, Users, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { MemberInfo } from "./member-info";

interface WorkspaceSidebarProps {
  slug: string
  currentWokspace: RouterOutput["workspace"]["getBySlug"]
}

export function WorkspaceSidebar({ slug, currentWokspace }: WorkspaceSidebarProps) {
  const pathname = usePathname() || ""
  const router = useRouter();
  const { can } = usePermission();
  const { data: workspaces = [currentWokspace] } = trpc.workspace.get.useQuery();
  const { openDialog } = useDialog();

  const routes = [
    {
      label: "Visão Geral",
      icon: LayoutDashboard,
      href: `/w/${slug}`,
      active: pathname === `/w/${slug}`,
      permissions: []
    },
    {
      label: "Membros",
      icon: Users,
      href: `/w/${slug}/members`,
      active: pathname.includes(`/${slug}/members`),
      permissions: [Permission.GET_MEMBERS]
    },
    {
      label: "Faturamento",
      icon: CreditCard,
      href: `/w/${slug}/billing`,
      active: pathname === `/w/${slug}/billing`,
      permissions: [Permission.GET_BILLING]
    },
    {
      label: "Configurações",
      icon: Settings,
      href: `/w/${slug}/settings`,
      active: pathname === `/w/${slug}/settings`,
      permissions: [Permission.UPDATE_WORKSPACE]
    },
  ]

  const handleWorkspaceChange = (value: string) => router.push(`/w/${value}`)

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
              {workspaces.filter(w => w.disabledAt === null).map(ws => (
                <SelectItem key={ws.id} value={ws.slug}>
                  {ws.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <button
                onClick={() => openDialog({ type: DialogType.CREATE_WORKSPACE })}
                className='flex items-center gap-3 rounded-md w-full px-3 py-1.5 text-sm font-medium transition-colors bg-primary/10 text-primary'
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Workspace
              </button>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {routes.filter(route => can(route.permissions)).map((route) => (
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

        <MemberInfo />
      </div>
    </div>
  )
}
