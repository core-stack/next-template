"use client"

import {
  ChevronDown, CreditCard, HelpCircle, LayoutDashboard, LogOut, Moon, Settings, Sun, User, Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useTheme } from '@/components/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface WorkspaceSidebarProps {
  slug: string
}

export function WorkspaceSidebar({ slug }: WorkspaceSidebarProps) {
  const pathname = usePathname() || ""
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()

  // Dados de exemplo do usuário - em produção, estes viriam do backend
  const user = {
    name: "João Silva",
    email: "joao@exemplo.com",
    image: null,
  }

  // Dados de exemplo de workspaces - em produção, estes viriam do backend
  const workspaces = [
    { id: "1", slug: "agencia-digital", name: "Agência Digital" },
    { id: "2", slug: "consultoria-tech", name: "Consultoria Tech" },
    { id: "3", slug: "estudio-design", name: "Estúdio Design" },
  ]

  const routes = [
    {
      label: "Visão Geral",
      icon: LayoutDashboard,
      href: `/${slug}`,
      active: pathname === `/${slug}`,
    },
    {
      label: "Membros",
      icon: Users,
      href: `/${slug}/members`,
      active: pathname.includes(`/${slug}/members`),
    },
    {
      label: "Faturamento",
      icon: CreditCard,
      href: `/${slug}/billing`,
      active: pathname === `/${slug}/billing`,
    },
    {
      label: "Configurações",
      icon: Settings,
      href: `/${slug}/settings`,
      active: pathname === `/${slug}/settings`,
    },
  ]

  const handleWorkspaceChange = (value: string) => {
    window.location.href = `/${value}`
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen sticky top-0 overflow-y-auto",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      {!isCollapsed ? (
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
      ) : (
        <div className="flex justify-center p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Seus workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem key={ws.id} asChild>
                  <Link href={`/workspaces/${ws.slug}`}>{ws.name}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/workspaces">
                  <span className="flex items-center gap-2">
                    <span className="text-primary">+</span> Criar novo workspace
                  </span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

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
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4 py-4">
        {/* Card de Upgrade */}
        <div
          className={cn(
            "rounded-lg bg-gradient-to-r from-primary/80 to-primary p-4 text-white mb-4",
            isCollapsed ? "hidden" : "block",
          )}
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

        {/* Perfil do Usuário */}
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-3 rounded-md p-2 cursor-pointer hover:bg-muted transition-colors",
                isCollapsed ? "justify-center" : "",
              )}
            >
              <Avatar>
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
              {!isCollapsed && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80" align={isCollapsed ? "center" : "start"}>
            <div className="flex items-center gap-4 pb-4 border-b mb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{user.name}</h4>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-1 py-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <User className="h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>
              <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted w-full text-left">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </button>

              {/* Menu de seleção de tema */}
              <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")} variant="ghost" className="rounded-md">
                {
                  theme === "light" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Modo Claro</span>
                      <span className="ml-auto"></span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Modo Escuro</span>
                      <span className="ml-auto"></span>
                    </>
                  )
                }
              </Button>
              <Link
                href="/help"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Ajuda e Suporte</span>
              </Link>
            </div>

            <div className="pt-2 border-t">
              <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted w-full text-left text-red-500 hover:text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
