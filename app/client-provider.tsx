'use client';

import type { ThemeProviderProps } from 'next-themes';

import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR, { SWRConfig } from 'swr';
import { ToastProvider } from '@heroui/react';
import Cookies from 'js-cookie';

import { GLOBAL_SOCKET_INIT } from '@/common/global';
// import { initSocket } from '@/helpers/socket';
import { useAccount } from '@/hooks/auth/useAccount';
import PreLoader from '@/components/PreLoader';
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

const ClientProvider = ({ children, themeProps }: ProvidersProps) => {
  const router = useRouter();

  const { initUser, initUserMutation, accountInfo } = useAccount();

  const { data: socketInit } = useSWR(GLOBAL_SOCKET_INIT);

  useEffect(() => {
    if (!socketInit) {
      initSocket();
    }
  }, [socketInit]);

  useEffect(() => {
    if (accountInfo?.data == null) {
      const token = Cookies.get('auth');

      if (token) {
        initUser(token);
      }
    }
  }, [accountInfo?.data]);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <SWRConfig
          value={{
            revalidateOnFocus: true,
            revalidateOnMount: true,
            revalidateOnReconnect: true,
            errorRetryCount: 0,
          }}
        >
          {initUserMutation?.isMutating ? (
            <div className="flex-1 w-full items-center justify-center h-screen">
              <PreLoader />
            </div>
          ) : (
            children
          )}
          <ToastProvider maxVisibleToasts={3} placement="top-right" />
        </SWRConfig>
      </NextThemesProvider>
    </HeroUIProvider>
  );
};

export default ClientProvider;
