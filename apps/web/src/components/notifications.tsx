"use client"

import { getMessaging, onMessage } from "firebase/messaging";
import { Info } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import firebaseApp from "@/lib/firebase";
import { trpc } from "@/lib/trpc/client";
import { NotificationSchema } from "@/lib/trpc/schema/notification";
import { cn } from "@/lib/utils";

type NotificationContextType = {
  notifications: NotificationSchema[]
  unreadNotifications: boolean
  unreadCount: number
  markAllAsRead: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  showNotifications: () => void
  hideNotifications: () => void
}
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadNotifications: false,
  unreadCount: 0,
  markAllAsRead: () => Promise.resolve(),
  markAsRead: () => Promise.resolve(),
  showNotifications: () => { },
  hideNotifications: () => { },
})
type Props = {
  children: React.ReactNode
}
export function NotificationsProvider({ children }: Props) {
  const [open, setOpen] = useState(false)
  const showNotifications = () => setOpen(true)
  const hideNotifications = () => setOpen(false)
  const { slug } = useParams<{ slug: string }>()

  const utils = trpc.useUtils()
  const { data: notificationsData } = trpc.notification.getNotifications.useQuery({ slug }, { initialData: [] })
  const notifications = notificationsData.map((notification: NotificationSchema) => ({
    ...notification,
    createdAt: new Date(notification.createdAt),
    readAt: notification.readAt ? new Date(notification.readAt) : null,
    createdBy: notification.createdBy ? {
      ...notification.createdBy,
      createdAt: new Date(notification.createdBy.createdAt),
      updatedAt: new Date(notification.createdBy.updatedAt)
    } : null,
    destination: {
      ...notification.destination,
      createdAt: new Date(notification.destination.createdAt),
      updatedAt: new Date(notification.destination.updatedAt)
    }
  }))
  const { mutateAsync: markAllAsReadMutation } = trpc.notification.markAllAsRead.useMutation()
  const { mutateAsync: markAsReadMutation } = trpc.notification.markAsRead.useMutation()
  const unreadNotifications = notifications?.some((notification: NotificationSchema) => !notification.read)
  const unreadCount = notifications?.filter((notification: NotificationSchema) => !notification.read).length

  const markAllAsRead = async () => {
    await markAllAsReadMutation({ slug })
    await utils.notification.getNotifications.invalidate({ slug })
  }
  const markAsRead = async (id: string) => {
    await markAsReadMutation({ slug, id })
    await utils.notification.getNotifications.invalidate({ slug })
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground push notification received:', payload);
      });
      return () => {
        unsubscribe();
      };
    }
  }, []);

  return (
    <NotificationContext.Provider value={
      { notifications, unreadNotifications, unreadCount, markAllAsRead, markAsRead, showNotifications, hideNotifications }
    }>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md" hideCloseButton>
          <SheetHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>Notificações</SheetTitle>
              <SheetDescription>
                {unreadNotifications && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Marcar todas como lidas
                  </Button>
                )}
              </SheetDescription>
            </div>
          </SheetHeader>

          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">Não lidas {unreadNotifications && `(${unreadCount})`}</TabsTrigger>
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
              {notifications.filter((n: NotificationSchema) => !n.read).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma notificação não lida</p>
                </div>
              ) : (
                notifications
                  .filter((n: NotificationSchema) => !n.read)
                  .map((notification: NotificationSchema) => (
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
  notification: NotificationSchema
  onRead: (id: string) => void
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  return (
    <div
      className={cn(
        "block p-4 rounded-lg transition-colors",
        notification.read ? "bg-background hover:bg-muted/50" : "bg-muted/50 hover:bg-muted",
        "border",
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex items-start gap-4">
        {notification.createdBy ? (
          <Avatar>
            <AvatarImage src={notification.createdBy?.user.image || undefined} />
            <AvatarFallback>{notification.createdBy?.user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
          <p className="text-sm text-muted-foreground">{notification.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{moment(notification.createdAt).locale("pt-br").fromNow()}</p>
            <div className="flex items-center gap-2">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onRead(notification.id);
                  }}
                >
                  Marcar como lida
                </Button>
              )}
              {notification.link && (
                <Button
                  variant="default"
                  size="sm"
                  asChild
                >
                  <Link href={notification.link}>
                    Acessar
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
