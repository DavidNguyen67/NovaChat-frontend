/* eslint-disable prettier/prettier */
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAccount } from '@/hooks/auth/useAccount';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter();

  const { accountInfo } = useAccount();

  useEffect(() => {
    if (accountInfo?.data) {
      router.push('/');
    }
  }, [accountInfo?.data]);

  if (accountInfo?.data) return null;

  return children;
};

export default AuthLayout;
