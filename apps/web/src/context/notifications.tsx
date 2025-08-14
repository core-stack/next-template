"use client";

import { getMessaging, onMessage } from 'firebase/messaging';
import { Info } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import useFcmToken from '@/hooks/use-fcm-token';
import firebaseApp from '@/lib/firebase.client';
import { cn } from '@/lib/utils';
import { ArrayElement } from '@/types/array';
import { GetNotificationsSchema } from '@packages/schemas';

type NotificationContextType = {
  notifications?: GetNotificationsSchema
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
  markAllAsRead: Promise.resolve,
  markAsRead: Promise.resolve,
  showNotifications: () => { },
  hideNotifications: () => { },
})

type Props = {
  children: React.ReactNode
}

export function NotificationsProvider({ children }: Props) {
  const t = useTranslations();
  useFcmToken();
  const [open, setOpen] = useState(false)
  const showNotifications = () => setOpen(true)
  const hideNotifications = () => setOpen(false)
  const { slug } = useParams<{ slug: string }>()

  const invalidate = useApiInvalidate();
  const { data: notifications } = useApiQuery("[GET] /api/tenant/:slug/notification", { params: { slug } });
  const { mutateAsync: markAllAsReadMutation } = useApiMutation("[POST] /api/tenant/:slug/notification/mark-all-as-read");
  const { mutateAsync: markAsReadMutation } = useApiMutation("[POST] /api/tenant/:slug/notification/mark-as-read");
  const unreadNotifications = notifications?.some(notification => !notification.read) ?? false
  const unreadCount = notifications?.filter(notification => !notification.read).length ?? 0

  const markAllAsRead = async () => {
    await markAllAsReadMutation({ params: { slug } })
    invalidate("[GET] /api/tenant/:slug/notification")
  }
  const markAsRead = async (id: string) => {
    await markAsReadMutation({ params: { slug }, body: { id } })
    invalidate("[GET] /api/tenant/:slug/notification")
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
              <SheetTitle>{t/*i18n*/("Notifications")}</SheetTitle>
              <SheetDescription>
                {unreadNotifications && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    {t/*i18n*/("Mark all as read")}
                  </Button>
                )}
              </SheetDescription>
            </div>
          </SheetHeader>

          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">{t/*i18n*/("All")}</TabsTrigger>
              <TabsTrigger value="unread">
                {t/*i18n*/("Unread")} {unreadNotifications && `(${unreadCount})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-4">
              {notifications?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t/*i18n*/("No notifications")}</p>
                </div>
              ) : (
                notifications?.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />
                ))
              )}
            </TabsContent>

            <TabsContent value="unread" className="mt-4 space-y-4">
              {notifications?.filter(n => !n.read).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t/*i18n*/("No unread notifications")}</p>
                </div>
              ) : (
                notifications?.filter(n => !n.read)
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
  notification: ArrayElement<GetNotificationsSchema>
  onRead: (id: string) => void
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const t = useTranslations();
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
            <p className="text-xs text-muted-foreground">{moment(notification?.createdAt).fromNow()}</p>
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
                  {t/*i18n*/("Mark as read")}
                </Button>
              )}
              {notification.link && (
                <Button
                  variant="default"
                  size="sm"
                  asChild
                >
                  <Link href={notification.link}>
                    {t/*i18n*/("Access")}
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
