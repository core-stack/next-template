'use client';

import { trpc } from "@/lib/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, httpLink, isNonJsonSerializable, splitLink } from "@trpc/client";
import { useState } from "react";

const url = "/api/trpc";
export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const [queryClient] = useState(new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition: (op) => isNonJsonSerializable(op.input),
          true: httpLink({
            url,
          }),
          false: httpBatchLink({ url }),
        })
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}