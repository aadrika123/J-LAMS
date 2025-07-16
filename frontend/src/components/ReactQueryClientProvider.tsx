"use client";
import React, { useState } from "react";
// import { QueryClient, QueryClientProvider } from "react-query";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'



export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
  }) => {
  // const queryClient = new QueryClient()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

  );
};
