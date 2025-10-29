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

import { useSession } from '@/hooks/auth/useSession';
import { getUrlMedia } from '@/helpers';

const ProfileDropdown = () => {
  const { sessionInfo } = useSession();

  const fallBackChar =
    sessionInfo?.data?.fullName ?? sessionInfo?.data?.username;

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
            src={getUrlMedia(sessionInfo?.data?.avatarUrl!)}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        className="w-[250px]"
        variant="flat"
      >
        <DropdownItem key="profile-header">
          <div className="flex items-center gap-3">
            <Avatar
              fallback={fallBackChar?.charAt(0).toUpperCase()}
              radius="md"
              size="lg"
              src={getUrlMedia(sessionInfo?.data?.avatarUrl!)}
            />
            <div className="flex flex-col">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {fallBackChar || 'Unknown User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {sessionInfo?.data?.email || 'No email'}
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
