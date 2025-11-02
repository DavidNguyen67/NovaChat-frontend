/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import { Avatar, Divider, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

import { useAccount } from '@/hooks/auth/useAccount';
import { getUrlMedia } from '@/helpers';

const SlideBar = () => {
  const mainMenu = [
    { icon: 'mdi:account-multiple-outline', label: 'Friends' },
    { icon: 'mdi:image-multiple-outline', label: 'Memories' },
    { icon: 'mdi:bookmark-outline', label: 'Saved' },
    { icon: 'mdi:account-group-outline', label: 'Groups' },
    { icon: 'mdi:play-circle-outline', label: 'Video' },
    { icon: 'mdi:store-outline', label: 'Marketplace' },
  ];

  const shortcuts = [
    { name: 'Pass đồ sinh viên giá rẻ Hà Nội' },
    { name: 'Việc làm IT - Tuyển dụng Backend/Frontend developer' },
    { name: 'Trà Đá Bách Khoa' },
    { name: 'Cho Thuê Nhà Nguyên Căn Tại Hà Nội' },
    { name: 'Trà đá Bách Khoa' },
  ];
  const { accountInfo } = useAccount();

  const fallBackChar =
    accountInfo?.data?.fullName ?? accountInfo?.data?.username;

  return (
    <aside
      className={clsx('h-full w-64 flex flex-col py-4 border-r border-divider')}
    >
      <ScrollShadow
        hideScrollBar
        className="flex flex-col flex-1 overflow-y-auto px-3"
      >
        {/* Profile Section */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-all duration-150">
          <Avatar
            className="size-8"
            fallback={fallBackChar?.charAt(0).toUpperCase()}
            radius="full"
            size="md"
            src={getUrlMedia(accountInfo?.data?.avatarUrl!)}
          />
          <span className="font-medium text-sm">
            {accountInfo?.data?.fullName || accountInfo?.data?.username}
          </span>
        </div>

        {/* Meta AI Section */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-all duration-150">
          <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
            <Icon className="size-5" icon="mdi:sparkles-outline" />
          </div>
          <span className="font-medium text-sm">Meta AI</span>
        </div>

        <Divider className="my-3" />

        {/* Main Menu */}
        <div className="flex flex-col gap-1">
          {mainMenu.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-all duration-150"
            >
              <Icon className="size-5 text-primary/70" icon={item.icon} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-all duration-150">
            <Icon
              className="size-5 text-foreground/70"
              icon="mdi:chevron-down"
            />
            <span className="text-sm font-medium">See more</span>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Shortcuts */}
        <div className="flex flex-col px-2">
          <span className="text-xs font-semibold text-foreground/60 mb-2 px-2">
            Your shortcuts
          </span>
          <div className="flex flex-col gap-1">
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-all duration-150"
              >
                <div className="size-8">
                  <Avatar
                    className="size-8"
                    fallback={fallBackChar?.charAt(0).toUpperCase()}
                    radius="full"
                    size="md"
                    src={getUrlMedia(accountInfo?.data?.avatarUrl!)}
                  />
                </div>
                <span className="text-sm font-medium truncate">{s.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-all duration-150">
              <Icon
                className="size-5 text-foreground/70"
                icon="mdi:chevron-down"
              />
              <span className="font-medium text-sm">See more</span>
            </div>
          </div>
        </div>
      </ScrollShadow>
    </aside>
  );
};

export default SlideBar;
