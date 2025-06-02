"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/context/notifications";
import { useTheme } from "@/context/theme";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, HelpCircle, LogOut, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const MemberInfo = () => {
  const { data: user } = trpc.user.self.useQuery();
  const { theme, setTheme } = useTheme();
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mutate } = trpc.auth.logout.useMutation();
  const handleLogout = () => {
    mutate(undefined, { onSuccess: () => router.push("/auth/login") });
  }
  const { showNotifications, unreadNotifications } = useNotifications();

  return (
    <Popover onOpenChange={setIsCollapsed} open={isCollapsed}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-3 transition-colors relative",
            isCollapsed ? "justify-center" : "",
          )}
        >
          <Avatar className='cursor-pointer'>
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {unreadNotifications && (
            <span className="absolute -top-0.5 -left-0.5 flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-sky-500 text-xs"></span>
            </span>
          )}
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
          <Button onClick={showNotifications} variant="ghost" className='justify-start rounded-md relative'>
            {unreadNotifications && (
              <span className="absolute -top-0.5 -left-0.5 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-sky-500 text-xs"></span>
              </span>
            )}
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </Button>
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <User className="h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted w-full text-left text-red-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}