import { Toaster } from "@/components/ui/toaster";
import { DialogProvider } from "@/context/dialog";
import { QueryClientContext } from "@/context/query-client";
import { ThemeProvider } from "@/context/theme";
import { dialogs } from "@/dialogs";
import { NextIntlClientProvider } from "next-intl";

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <NextIntlClientProvider>
      <QueryClientContext>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <DialogProvider dialogs={dialogs}>
            {children}
          </DialogProvider>
        </ThemeProvider>
        <Toaster />
      </QueryClientContext>
    </NextIntlClientProvider>
  )
}