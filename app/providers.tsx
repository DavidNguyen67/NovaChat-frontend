'use client';

import type { ThemeProviderProps } from 'next-themes';

import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR, { useSWRConfig } from 'swr';
import { ToastProvider } from '@heroui/react';

import { GLOBAL_SOCKET_INIT } from '@/common/global';
import { initSocket } from '@/helpers/socket';

dayjs.extend(relativeTime);

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: socketInit } = useSWR(GLOBAL_SOCKET_INIT);

  useEffect(() => {
    if (!socketInit) {
      initSocket();
    }
  }, [socketInit]);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {children}
        <ToastProvider maxVisibleToasts={3} placement="top-right" />
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
