/* eslint-disable prettier/prettier */
'use client';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { useMutation } from '../swr';

import { useAuth } from './useAuth';
import { mockUser } from './config';

import { GLOBAL_ACCOUNT_INFO, GLOBAL_SOCKET_INIT } from '@/common/global';
import { User } from '@/interfaces/response';
import { LoginFormValues } from '@/components/LoginForm/config';
import { RegisterFormValues } from '@/components/RegisterForm/config';
import { ApiResponse } from '@/interfaces';
import { METHOD } from '@/common';

export const useAccount = () => {
  const router = useRouter();

  const { data: socketInit } = useSWR(GLOBAL_SOCKET_INIT);

  const { login: loginMutation, register: registerMutation } = useAuth();

  const initUserMutation = useMutation<ApiResponse<any>>('/api/v1/user-info', {
    url: '/api/v1/user-info',
    method: METHOD.POST,
    onError: () => {
      router.push('/login');
    },
    notification: {
      title: 'Initialize User Info',
    },
    ignoreSuccessNotification: true,
  });

  const accountInfo = useSWR<User | null>(GLOBAL_ACCOUNT_INFO);

  const initUser = async (token: string) => {
    // await initUserMutation.trigger({ token });
    accountInfo.mutate(mockUser);
  };

  const login = async (values: LoginFormValues) => {
    try {
      // await loginMutation.trigger(values);
      initUser('');
    } catch (error) {}
  };

  const register = async (values: RegisterFormValues) => {
    try {
      await registerMutation.trigger(values);
    } catch (error) {}
  };

  const logout = async () => {
    try {
      // await requestLogout({
      //   refresh_token: session?.refeshToken,
      // });
    } catch (error) {
      console.log(error);
    }
    Cookies.set('auth', '');
    if (socketInit) {
    }
    accountInfo.mutate(null);
  };

  return {
    accountInfo,
    initUser,
    login,
    register,
    initUserMutation,
    logout,
  };
};
