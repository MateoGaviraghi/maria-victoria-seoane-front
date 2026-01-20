import { DefaultOptions, QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
