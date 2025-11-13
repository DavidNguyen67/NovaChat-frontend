/* eslint-disable prettier/prettier */
'use client';

import React, { useState } from 'react';
import { Avatar, Button } from '@heroui/react';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import 'react-photo-view/dist/react-photo-view.css';

import FallBack from '../FallBack';

import FriendSlider from './FriendSlider';
import ProfileTabs from './ProfileTabs';
import CoverPhotoEditor from './CoverPhotoEditor';
import ProfileSkeleton from './ProfileSkeleton';

import { getUrlMedia } from '@/helpers';
import { Friend } from '@/interfaces/response';
import { useSWRWrapper } from '@/hooks/swr';
import { METHOD } from '@/common';

interface ProfileProps {
  userId: string;
}

const Profile = ({ userId }: ProfileProps) => {
  const [isMore, setIsMore] = useState(false);

  const accountInfo = useSWRWrapper<Friend>(`/api/v1/user/${userId}`, {
    url: () => `/api/v1/user/${userId}`,
    method: METHOD.GET,
    enable: Boolean(userId),
    notification: {
      title: 'Load user info',
    },
  });

  const fallBackChar = accountInfo?.data?.fullName;

  const coverUrl = getUrlMedia(accountInfo?.data?.avatarUrl!);

  if (accountInfo.error) {
    return (
      <FallBack
        error={accountInfo.error}
        type="error"
        onRetry={accountInfo.mutate}
      />
    );
  }

  if (accountInfo.data) {
    return (
      <div className="flex flex-col w-full overflow-y-auto flex-1 rounded-2xl h-full hide-scrollbar">
        <div className="relative w-full">
          <div className="relative w-full h-[300px] md:h-[320px]">
            <CoverPhotoEditor coverUrl={coverUrl} />

            <div className="absolute top-[calc(100%-2rem)] left-0 right-0 flex flex-col gap-4 px-6 md:px-24 z-10 flex-1">
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                <div className="flex items-end gap-4">
                  <div className="size-30">
                    <Avatar
                      className="size-30 border-4 border-background dark:border-content2 shadow-lg"
                      fallback={fallBackChar?.charAt(0)}
                      src={getUrlMedia(accountInfo?.data?.avatarUrl!)}
                    />
                  </div>
                  <div className="hidden md:flex flex-col gap-1 pb-4 text-start">
                    <h1 className="text-3xl font-bold text-foreground">
                      {accountInfo?.data?.fullName ?? 'User Name'}
                    </h1>
                    <p className="text-sm text-default-500">313 friends</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 items-center mb-[0.5rem]">
                  <Button
                    color="primary"
                    radius="lg"
                    startContent={<Icon icon="mdi:book-plus-outline" />}
                    variant="flat"
                  >
                    Add to story
                  </Button>

                  <Button
                    color="secondary"
                    radius="lg"
                    startContent={<Icon icon="mdi:account-edit-outline" />}
                    variant="flat"
                  >
                    Edit profile
                  </Button>

                  <Button
                    isIconOnly
                    className="transition-all duration-200 active:scale-95 hover:bg-default-100/50"
                    radius="lg"
                    variant="light"
                    onPress={() => setIsMore(!isMore)}
                  >
                    <Icon
                      className={clsx(
                        'text-xl text-default-600 transition-transform',
                        { 'rotate-180': isMore },
                      )}
                      icon="mdi:chevron-down"
                    />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:hidden items-center text-center mt-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {accountInfo?.data?.fullName ?? 'User Name'}
                </h1>
                <p className="text-sm text-default-500">
                  {accountInfo?.data?.numberOfFriends} friends
                </p>
              </div>
            </div>
          </div>

          <div className="pt-26 px-6 md:px-24 z-20 flex-1 flex gap-4 flex-col h-full pb-6">
            {isMore && <FriendSlider />}
            <ProfileTabs />
          </div>
        </div>
      </div>
    );
  }

  return <ProfileSkeleton />;
};

export default Profile;
