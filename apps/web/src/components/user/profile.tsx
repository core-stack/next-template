"use client";
import { ChevronDown, HelpCircle, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';

import { useTheme } from '../theme-provider';
import { Button } from '../ui/button';

export const UserProfile = () => {
  const { data: user } = trpc.user.self.useQuery();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Popover onOpenChange={setIsCollapsed} open={isCollapsed}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-3 rounded-md p-2 cursor-pointer hover:bg-muted transition-colors",
            isCollapsed ? "justify-center" : "",
          )}
        >
          <Avatar>
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          {!isCollapsed && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align={isCollapsed ? "center" : "start"}>
        <div className="flex items-center gap-4 pb-4 border-b mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user?.name}</h4>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
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
  )
}