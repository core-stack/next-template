"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import moment from "moment";
import { createContext, useContext, useState } from "react";

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

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  markAllAsRead: () => void
  markAsRead: (id: string) => void
  showNotifications: () => void
  hideNotifications: () => void
}
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  markAsRead: () => {},
  showNotifications: () => {},
  hideNotifications: () => {},
})
type Props = {
  children: React.ReactNode
}
export function NotificationsProvider({ children }: Props) {
  const [open, setOpen] = useState(false)
  const showNotifications = () => setOpen(true)
  const hideNotifications = () => setOpen(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

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

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead, showNotifications, hideNotifications }}>
      <Sheet open={open} onOpenChange={setOpen}>
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
      {children}
    </NotificationContext.Provider>
  )
}
export const useNotifications = () => useContext(NotificationContext)

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
            <span className="text-lg"><Info /></span>
          </div>
        )}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
          </div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <p className="text-xs text-muted-foreground">{moment(notification.date).fromNow()}</p>
        </div>
      </div>
    </a>
  )
}
