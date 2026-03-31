'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
})

/**
 * Client-side providers wrapper:
 * TanStack Query + Sonner toasts.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
