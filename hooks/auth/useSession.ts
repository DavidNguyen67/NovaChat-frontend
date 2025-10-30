/* eslint-disable prettier/prettier */
import useSWR from 'swr';

import { useAuth } from './useAuth';

import { GLOBAL_SESSION_INFO } from '@/common/global';
import { User } from '@/interfaces/response';
import { LoginFormValues } from '@/components/LoginForm/config';
import { RegisterFormValues } from '@/components/RegisterForm/config';

export const useSession = () => {
  const { login: loginMutation, register: registerMutation } = useAuth();

  const sessionInfo = useSWR<User>(GLOBAL_SESSION_INFO);

  const initUser = () => {};

  const login = async (values: LoginFormValues) => {
    try {
      await loginMutation.trigger(values);
    } catch (error) {}
  };

  const register = async (values: RegisterFormValues) => {
    try {
      await registerMutation.trigger(values);
    } catch (error) {}
  };

  return {
    sessionInfo,
    initUser,
    login,
    register,
  };
};
