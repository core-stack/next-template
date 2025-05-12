'use client';

import { useState } from "react";
import superJSON from "superjson";

import { trpc } from "@/lib/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, httpLink, isNonJsonSerializable, splitLink } from "@trpc/client";

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
            transformer: superJSON,
          }),
          false: httpBatchLink({ url, transformer: superJSON }),
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