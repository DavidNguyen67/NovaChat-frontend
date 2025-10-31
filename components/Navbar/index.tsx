/* eslint-disable prettier/prettier */
'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import { Button, Input } from '@heroui/react';
import Image from 'next/image';

import { TabNavBar } from './config';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import ThemeSwitcher from './ThemeSwitcher';

import { useAccount } from '@/hooks/auth/useAccount';

const Navbar = () => {
  const middleNavBar: TabNavBar[] = [
    { onPress: () => {}, icon: 'mdi:home-outline' },
    { onPress: () => {}, icon: 'mdi:account-group-outline' },
    { onPress: () => {}, icon: 'mdi:monitor-dashboard' },
    { onPress: () => {}, icon: 'mdi:storefront-outline' },
    { onPress: () => {}, icon: 'mdi:video-outline' },
  ];

  const { accountInfo: accountInfo } = useAccount();

  if (accountInfo?.data == null) return null;

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#f5f6f7] dark:bg-[#242526] border-b border-gray-200 dark:border-[#3A3B3C] text-gray-900 dark:text-white fixed top-0 left-0 right-0 z-50 h-14 transition-colors">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-2">
        <Image
          alt="Facebook"
          className="rounded-full"
          height={36}
          src="/facebook-logo.png"
          width={36}
        />

        <div className="hidden sm:flex">
          <Input
            classNames={{
              inputWrapper:
                'bg-gray-200 dark:bg-[#3A3B3C] border-none rounded-full py-1.5 px-3 text-gray-700 dark:text-gray-200 transition-colors',
              input: 'text-sm placeholder-gray-500 dark:placeholder-gray-400',
            }}
            placeholder="Search Facebook"
            size="sm"
            startContent={
              <Icon
                className="text-gray-500 dark:text-gray-400 text-lg"
                icon="mdi:magnify"
              />
            }
            type="search"
            variant="bordered"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {middleNavBar.map((item, index) => (
          <Button
            key={index}
            isIconOnly
            className="text-2xl text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#3A3B3C] rounded-md transition"
            size="md"
            variant="ghost"
            onPress={item.onPress}
          >
            <Icon className="text-2xl" icon={item.icon} />
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />

        <NotificationDropdown />

        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
