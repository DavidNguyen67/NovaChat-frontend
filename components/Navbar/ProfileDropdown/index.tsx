/* eslint-disable prettier/prettier */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

import { useAccount } from '@/hooks/auth/useAccount';
import { getUrlMedia } from '@/helpers';

const ProfileDropdown = () => {
  const { accountInfo, logout } = useAccount();

  const router = useRouter();

  const fallBackChar =
    accountInfo?.data?.fullName ?? accountInfo?.data?.username;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          className="bg-gray-200 dark:bg-[#3A3B3C] hover:bg-gray-300 dark:hover:bg-[#4E4F50] rounded-full transition"
          size="sm"
        >
          <Avatar
            fallback={fallBackChar?.charAt(0)}
            radius="full"
            size="sm"
            src={getUrlMedia(accountInfo?.data?.avatarUrl!)}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        className="w-[250px]"
        variant="flat"
        onAction={(key) => {
          if (key === 'logout') {
            logout();
          }
          if (key === 'profile-header') {
            router.push(`/profile/${accountInfo?.data?.id}`);
          }
        }}
      >
        <DropdownItem
          key="profile-header"
          className="w-full"
          classNames={{
            title: 'w-full h-full',
          }}
        >
          <div className="flex items-center gap-3 w-full flex-1 h-full">
            <div className="size-8">
              <Avatar
                className="size-8"
                fallback={fallBackChar?.charAt(0).toUpperCase()}
                radius="md"
                size="md"
                src={getUrlMedia(accountInfo?.data?.avatarUrl!)}
              />
            </div>
            <div className="flex flex-col flex-1 h-full w-full overflow-hidden line-clamp-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {fallBackChar}
              </p>
            </div>
          </div>
        </DropdownItem>

        <DropdownItem
          key="settings"
          startContent={
            <Icon
              className="text-gray-700 dark:text-gray-300 text-lg"
              icon="mdi:cog-outline"
            />
          }
        >
          Settings
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          startContent={
            <Icon
              className="text-red-500 dark:text-red-400 text-lg"
              icon="mdi:logout"
            />
          }
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
