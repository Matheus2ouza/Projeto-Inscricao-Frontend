'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos por padrão
            staleTime: 5 * 60 * 1000,
            // Manter dados em cache por 10 minutos
            gcTime: 10 * 60 * 1000,
            // Retry automático em caso de erro
            retry: 2,
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: false,
            // Refetch quando reconecta à internet
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry para mutations também
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
