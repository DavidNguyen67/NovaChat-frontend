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
import ChatRoomDropdown from './ChatRoomDropdown';

import NovaLogoIcon from '@/assets/svg/nova-logo.svg';
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
    <header
      className=" fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 py-2 bg-gradient-to-r from-[#4A00E0]/90 via-[#8E2DE2]/90 to-[#4A00E0]/90 dark:from-[#0f0c29]/90 dark:via-[#302b63]/90 dark:to-[#24243e]/90 backdrop-blur-md border-b border-white/10 text-white transition-all shadow-lg
  "
    >
      <div className="flex items-center gap-3">
        <Image
          alt="Nova"
          className="rounded-xl shadow-md"
          height={36}
          src={NovaLogoIcon}
          width={36}
        />

        <div className="hidden sm:flex">
          <Input
            classNames={{
              inputWrapper:
                'bg-white/20 hover:bg-white/25 dark:bg-white/10 dark:hover:bg-white/15 border-none rounded-full py-1.5 px-3 text-white transition-all',
              input: 'text-sm placeholder-white/70',
            }}
            placeholder="Search Nova"
            size="sm"
            startContent={
              <Icon className="text-white/70 text-lg" icon="mdi:magnify" />
            }
            type="search"
            variant="bordered"
          />
        </div>
      </div>

      {/* Middle nav buttons */}
      <div className="flex items-center gap-3">
        {middleNavBar.map((item, index) => (
          <Button
            key={index}
            isIconOnly
            className="
          text-2xl text-white/90 hover:text-white
          hover:bg-white/20 active:scale-95
          transition-all duration-200 rounded-xl
        "
            size="md"
            variant="ghost"
            onPress={item.onPress}
          >
            <Icon className="text-2xl" icon={item.icon} />
          </Button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <ChatRoomDropdown />
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
