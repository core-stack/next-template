import { NotificationsProvider } from "@/components/notifications";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TRPCProvider } from "@/lib/trpc/provider";

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <>
      <TRPCProvider>
        <NotificationsProvider>
          <ThemeProvider defaultTheme="system" storageKey="theme">
            {children}
          </ThemeProvider>
        </NotificationsProvider>
      </TRPCProvider>
      <Toaster />
    </>
  )
}