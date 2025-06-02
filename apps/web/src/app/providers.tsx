import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/theme";
import { TRPCProvider } from "@/lib/trpc/provider";

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <>
      <TRPCProvider>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          {children}
        </ThemeProvider>
      </TRPCProvider>
      <Toaster />
    </>
  )
}