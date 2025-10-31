/* eslint-disable prettier/prettier */
import { useRef } from 'react';

import { useMutation } from '../swr';

import { ApiResponse } from '@/interfaces';
import { METHOD } from '@/common';

export const useAuth = () => {
  const notificationTile = useRef<string>('Authentication');

  const login = useMutation<ApiResponse<any>>('/api/v1/login', {
    url: '/api/v1/login',
    method: METHOD.POST,
    notification: {
      title: notificationTile.current,
      message: 'You have successfully logged in.',
    },
  });

  const register = useMutation<ApiResponse<any>>('/api/v1/register', {
    url: '/api/v1/register',
    method: METHOD.POST,
    notification: {
      title: notificationTile.current,
      message: 'You have successfully registered.',
    },
  });

  const checkEmail = useMutation<ApiResponse<boolean>>('/api/v1/check-email', {
    url: '/api/v1/check-email',
    method: METHOD.POST,
    notification: {
      title: notificationTile.current,
      message: 'Email is available.',
    },
  });

  const forgotPassword = useMutation<ApiResponse<any>>(
    '/api/v1/forgot-password',
    {
      url: '/api/v1/forgot-password',
      method: METHOD.POST,
      notification: {
        title: notificationTile.current,
        message: 'Password reset link has been sent.',
      },
    },
  );

  const verifyOtp = useMutation<ApiResponse<any>>('/api/v1/verify-otp', {
    url: '/api/v1/verify-otp',
    method: METHOD.POST,
  });

  return {
    login,
    register,
    checkEmail,
    forgotPassword,
    verifyOtp,
  };
};
