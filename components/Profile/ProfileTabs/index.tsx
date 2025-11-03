/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import clsx from 'clsx';

const tabItems = [
  { key: 'posts', label: 'Posts', icon: 'mdi:post-outline' },
  { key: 'about', label: 'About', icon: 'mdi:information-outline' },
  { key: 'friends', label: 'Friends', icon: 'mdi:account-multiple-outline' },
  { key: 'photos', label: 'Photos', icon: 'mdi:image-multiple-outline' },
  { key: 'reels', label: 'Reels', icon: 'mdi:movie-open-outline' },
  { key: 'checkins', label: 'Check-ins', icon: 'mdi:map-marker-outline' },
  { key: 'more', label: 'More', icon: 'mdi:dots-horizontal' },
];

interface ProfileTabsProps {
  value?: string;
  onChange?: (key: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ value, onChange }) => {
  return (
    <Card
      className="w-full mx-auto border border-default-200/60 dark:border-default-100/20 bg-content1/70 backdrop-blur-md h-full flex flex-col flex-1"
      shadow="sm"
    >
      <CardBody className="overflow-hidden">
        <Tabs
          aria-label="Profile tabs"
          classNames={{
            tabList:
              'flex justify-center md:justify-start gap-2 px-2 md:px-8 overflow-x-auto no-scrollbar',
            tab: clsx(
              'text-sm font-medium px-4 py-3 rounded-none transition-all',
              'data-[hover=true]:bg-default-100/50 dark:data-[hover=true]:bg-default-50/30',
            ),
            tabContent: 'flex items-center gap-2',
            cursor: 'bg-primary',
          }}
          color="primary"
          radius="none"
          selectedKey={value}
          variant="underlined"
          onSelectionChange={(key) => onChange?.(String(key))}
        >
          {tabItems.map((tab) => (
            <Tab key={tab.key} className="h-full flex-1" title={tab.label}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Tab>
          ))}
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default ProfileTabs;
