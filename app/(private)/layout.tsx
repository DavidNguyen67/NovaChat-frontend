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
    <div className="relative flex-grow overflow-hidden h-full w-full pt-14">
      {/* <div className="absolute top-8 left-4 z-20">
        <Button
          className="bg-content2/70 backdrop-blur-md hover:bg-content2/90 transition-all"
          radius="full"
          size="sm"
          startContent={
            <Icon className="text-xl text-foreground" icon="mdi:arrow-left" />
          }
          variant="flat"
          onPress={() => router.back()}
        >
          Back
        </Button>
      </div> */}

      <div className="flex flex-1 flex-col h-full w-full backdrop-blur-md shadow-lg rounded-xl pt-4">
        {children}
      </div>

      <div className="absolute bottom-0 right-0 z-20 h-[500px] flex flex-col" />
      <div className="absolute bottom-0 right-0 z-20 h-[500px] flex flex-col" />
    </div>
  );
};

export default PrivateLayout;
