"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFcmToken from "@/hooks/use-fcm-token";
import firebaseApp from "@/lib/firebase.client";
import { RouterOutput } from "@/lib/trpc/app.router";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { ArrayElement } from "@/types/array";
import { formatFromNow } from "@/utils/date";
import { getMessaging, onMessage } from "firebase/messaging";
import { Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type NotificationContextType = {
  notifications: RouterOutput["notification"]["getNotifications"]
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
  useFcmToken();
  const [open, setOpen] = useState(false)
  const showNotifications = () => setOpen(true)
  const hideNotifications = () => setOpen(false)
  const { slug } = useParams<{ slug: string }>()

  const utils = trpc.useUtils()
  const { data: notifications } = trpc.notification.getNotifications.useQuery({ slug }, { initialData: [] });
  const { mutateAsync: markAllAsReadMutation } = trpc.notification.markAllAsRead.useMutation()
  const { mutateAsync: markAsReadMutation } = trpc.notification.markAsRead.useMutation()
  const unreadNotifications = notifications?.some(notification => !notification.read)
  const unreadCount = notifications?.filter(notification => !notification.read).length

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
              {notifications.filter(n => !n.read).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma notificação não lida</p>
                </div>
              ) : (
                notifications
                  .filter(n => !n.read)
                  .map(notification => (
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
  notification: ArrayElement<RouterOutput["notification"]["getNotifications"]>
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
            <AvatarImage src={notification.createdBy?.image || undefined} />
            <AvatarFallback>{notification.createdBy?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
            <p className="text-xs text-muted-foreground">{formatFromNow(notification.createdAt)}</p>
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
