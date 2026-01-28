'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { ReactNode, useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/lib/toast-context';

const antdTheme = {
  token: {
    colorPrimary: '#3b82f6',
    colorBgBase: '#000000',
    colorBgContainer: '#0f0f0f',
    colorText: '#ffffff',
    colorTextSecondary: '#a0a0a0',
    colorBorder: '#2a2a2a',
    borderRadius: 8,
  },
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdTheme}>
          <ToastProvider>{children}</ToastProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

