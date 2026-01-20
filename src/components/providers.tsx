'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren, useState } from 'react';
import { queryClient as baseClient } from '@/lib/react-query';
import { Toaster } from 'sonner';

export function Providers({ children }: PropsWithChildren) {
  const [client] = useState(() => baseClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster position="top-right" richColors duration={3000} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
