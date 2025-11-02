/* eslint-disable prettier/prettier */
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LandingPage from '@/components/LandingPage';
import { useAccount } from '@/hooks/auth/useAccount';

const HomePage = () => {
  const router = useRouter();

  const { accountInfo } = useAccount();

  useEffect(() => {
    if (accountInfo?.data) {
      router.push('/home');
    }
  }, [accountInfo?.data]);

  if (accountInfo?.data) return null;

  return <LandingPage />;
};

export default HomePage;
