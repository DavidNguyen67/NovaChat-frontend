/* eslint-disable prettier/prettier */
import { useMutation } from '../swr';

import { METHOD } from '@/common';

export const useAuth = () => {
  const login = useMutation<any>('/api/v1/login', {
    url: '/api/v1/login',
    method: METHOD.POST,
  });

  const register = useMutation<any>('/api/v1/register', {
    url: '/api/v1/register',
    method: METHOD.POST,
  });

  const checkEmail = useMutation<boolean>('/api/v1/check-email', {
    url: '/api/v1/check-email',
    method: METHOD.POST,
  });

  return {
    login,
    register,
    checkEmail,
  };
};
