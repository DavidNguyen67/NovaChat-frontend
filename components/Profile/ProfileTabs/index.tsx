/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import clsx from 'clsx';

import PostTabContent from './PostTabContent';

const tabItems = [
  {
    key: 'posts',
    label: 'Posts',
    icon: 'mdi:post-outline',
    content: <PostTabContent />,
  },
  {
    key: 'about',
    label: 'About',
    icon: 'mdi:information-outline',
    content: <div>Posts Content</div>,
  },
  {
    key: 'friends',
    label: 'Friends',
    icon: 'mdi:account-multiple-outline',
    content: <div>Posts Content</div>,
  },
  {
    key: 'photos',
    label: 'Photos',
    icon: 'mdi:image-multiple-outline',
    content: <div>Posts Content</div>,
  },
  {
    key: 'reels',
    label: 'Reels',
    icon: 'mdi:movie-open-outline',
    content: <div>Posts Content</div>,
  },
  {
    key: 'checkins',
    label: 'Check-ins',
    icon: 'mdi:map-marker-outline',
    content: <div>Posts Content</div>,
  },
  {
    key: 'more',
    label: 'More',
    icon: 'mdi:dots-horizontal',
    content: <div>Posts Content</div>,
  },
];

interface ProfileTabsProps {
  value?: string;
  onChange?: (key: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ value, onChange }) => {
  return (
    <div className="w-full mx-auto h-full flex flex-col flex-1">
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
          <Tab key={tab.key} title={tab.label}>
            <Card>
              <CardBody>{tab.content}</CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
