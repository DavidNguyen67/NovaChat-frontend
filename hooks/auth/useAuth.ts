/* eslint-disable prettier/prettier */

import { useMutation } from '../swr';

import { ApiResponse } from '@/interfaces';
import { METHOD } from '@/common';

export const useAuth = () => {
  const login = useMutation<ApiResponse<any>>('/api/v1/login', {
    url: '/api/v1/login',
    method: METHOD.POST,
    notification: {
      title: 'Login',
      message: 'You have successfully logged in.',
    },
  });

  const register = useMutation<ApiResponse<any>>('/api/v1/register', {
    url: '/api/v1/register',
    method: METHOD.POST,
    notification: {
      title: 'Register',
      message: 'You have successfully registered.',
    },
  });

  const checkEmail = useMutation<ApiResponse<boolean>>('/api/v1/check-email', {
    url: '/api/v1/check-email',
    method: METHOD.POST,
    notification: {
      title: 'Validation email',
      message: 'Email is available.',
    },
  });

  const forgotPassword = useMutation<ApiResponse<any>>(
    '/api/v1/forgot-password',
    {
      url: '/api/v1/forgot-password',
      method: METHOD.POST,
      notification: {
        title: 'Forgot Password',
        message: 'Password reset link has been sent.',
      },
    },
  );

  const verifyOtp = useMutation<ApiResponse<any>>('/api/v1/verify-otp', {
    url: '/api/v1/verify-otp',
    method: METHOD.POST,
    notification: {
      title: 'Verify OTP',
      message: 'OTP has been sent to your email.',
    },
  });

  return {
    login,
    register,
    checkEmail,
    forgotPassword,
    verifyOtp,
  };
};
