/* eslint-disable prettier/prettier */
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAccount } from '@/hooks/auth/useAccount';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const { accountInfo } = useAccount();

  const router = useRouter();

  useEffect(() => {
    if (!accountInfo?.data) {
      router.push('/');
    }
  }, [accountInfo?.data]);

  if (!accountInfo?.data) return null;

  return (
    <div className="p-6 flex-grow overflow-hidden h-full w-full pt-12">
      <div className="flex flex-1 flex-col h-full w-full overflow-hidden backdrop-blur-md shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default PrivateLayout;
