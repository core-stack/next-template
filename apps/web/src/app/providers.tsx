import { NextIntlClientProvider } from 'next-intl';

import { Toaster } from '@/components/ui/toaster';
import { QueryClientContext } from '@/context/query-client';
import { ThemeProvider } from '@/context/theme';

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <NextIntlClientProvider>
      <QueryClientContext>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          {children}
        </ThemeProvider>
        <Toaster />
      </QueryClientContext>
    </NextIntlClientProvider>
  )
}