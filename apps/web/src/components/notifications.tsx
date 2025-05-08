"use client"

import { Bell } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Tipos para as notificações
interface Notification {
  id: string
  title: string
  message: string
  type: "invite" | "mention" | "system" | "update"
  read: boolean
  date: Date
  sender?: {
    name: string
    avatar?: string
  }
  link?: string
}

// Dados de exemplo para notificações
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Convite para workspace",
    message: "João Silva convidou você para participar do workspace 'Agência Digital'",
    type: "invite",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    sender: {
      name: "João Silva",
      avatar: undefined,
    },
    link: "/invite/abc123",
  },
  {
    id: "2",
    title: "Menção em comentário",
    message: "Maria Oliveira mencionou você em um comentário no projeto 'Website Redesign'",
    type: "mention",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    sender: {
      name: "Maria Oliveira",
      avatar: undefined,
    },
    link: "/workspaces/agencia-digital/projects/website-redesign",
  },
  {
    id: "3",
    title: "Atualização do sistema",
    message: "Uma nova versão do sistema está disponível. Veja as novidades!",
    type: "system",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    link: "/updates",
  },
  {
    id: "4",
    title: "Tarefa atribuída",
    message: "Carlos Santos atribuiu a tarefa 'Revisar design' para você",
    type: "update",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
    sender: {
      name: "Carlos Santos",
      avatar: undefined,
    },
    link: "/tasks/123",
  },
  {
    id: "5",
    title: "Convite para workspace",
    message: "Ana Pereira convidou você para participar do workspace 'Estúdio Design'",
    type: "invite",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dias atrás
    sender: {
      name: "Ana Pereira",
      avatar: undefined,
    },
    link: "/invite/def456",
  },
]

// Hook para usar notificações em qualquer componente
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  // Contar notificações não lidas
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  // Marcar uma notificação específica como lida
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    )
  }

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
  }
}

// Formatar data relativa
export function formatRelativeTime(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "agora mesmo"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minuto" : "minutos"} atrás`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hora" : "horas"} atrás`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "dia" : "dias"} atrás`
  }
}

// Obter ícone baseado no tipo de notificação
export function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "invite":
      return "👥"
    case "mention":
      return "💬"
    case "system":
      return "🔔"
    case "update":
      return "📋"
    default:
      return "📩"
  }
}

export function NotificationsSheet() {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notificações</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread">Não lidas {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
            <TabsTrigger value="invites">Convites</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-4 space-y-4">
            {notifications.filter((n) => !n.read).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma notificação não lida</p>
              </div>
            ) : (
              notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
                ))
            )}
          </TabsContent>

          <TabsContent value="invites" className="mt-4 space-y-4">
            {notifications.filter((n) => n.type === "invite").length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum convite</p>
              </div>
            ) : (
              notifications
                .filter((n) => n.type === "invite")
                .map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
                ))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  return (
    <a
      href={notification.link}
      className={cn(
        "block p-4 rounded-lg transition-colors",
        notification.read ? "bg-background hover:bg-muted/50" : "bg-muted/50 hover:bg-muted",
        "border",
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex items-start gap-4">
        {notification.sender ? (
          <Avatar>
            <AvatarImage src={notification.sender.avatar || undefined} />
            <AvatarFallback>{notification.sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
          </div>
        )}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
          </div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(notification.date)}</p>
        </div>
      </div>
    </a>
  )
}
