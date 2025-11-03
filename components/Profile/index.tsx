/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, Button, Image } from '@heroui/react';
import clsx from 'clsx';
import { Icon } from '@iconify/react';

import FriendSlider from './FriendSlider';
import ProfileTabs from './ProfileTabs';

import { useAccount } from '@/hooks/auth/useAccount';
import { getUrlMedia } from '@/helpers';

const Profile = () => {
  const { userId } = useParams();
  const { accountInfo } = useAccount();

  const fallBackChar =
    accountInfo?.data?.fullName ?? accountInfo?.data?.username;

  const coverUrl = accountInfo?.data?.coverUrl;

  const [isMore, setIsMore] = useState(false);

  return (
    <div className="flex flex-col w-full overflow-y-auto flex-1 rounded-2xl h-full hide-scrollbar">
      <div className="relative w-full">
        <div
          className="relative w-full h-[260px] md:h-[320px]"
          onClick={() => {}}
        >
          <Image
            alt="cover"
            className="w-full h-full object-cover rounded-b-2xl shadow-sm"
            classNames={{
              wrapper: '!max-w-full w-full !h-full !max-h-full',
              img: '!h-full !max-h-full',
            }}
            src={coverUrl}
          />
          <div className="absolute bottom-4 right-4 z-20">
            <Button
              className="cursor-pointer"
              color="default"
              radius="lg"
              startContent={<Icon icon="mdi:camera-outline" />}
              variant="shadow"
            >
              Edit cover photo
            </Button>
          </div>

          <div className="absolute top-[calc(100%-4rem)] left-0 right-0 flex flex-col gap-4 px-6 md:px-24 z-10 flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
              {/* Avatar & Name */}
              <div className="flex items-end gap-4">
                <Avatar
                  className="size-36 border-4 border-background dark:border-content2 shadow-lg"
                  fallback={fallBackChar?.charAt(0)}
                  src={getUrlMedia(accountInfo?.data?.avatarUrl!)}
                />
                <div className="hidden md:flex flex-col gap-1 pb-4">
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
              <p className="text-sm text-default-500">313 friends</p>
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 md:px-24 z-20 flex-1 flex gap-4 flex-col h-full pb-6">
          {isMore && <FriendSlider />}

          <ProfileTabs />
        </div>
      </div>
    </div>
  );
};

export default Profile;
