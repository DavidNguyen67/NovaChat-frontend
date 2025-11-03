/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import type { NotificationItem as Notification } from '@/interfaces/response';

import React, { useState } from 'react';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';
import dayjs from 'dayjs';

import { TYPE_NOTIFICATION_COLOR_MAPPING } from '../config';
import { useNotification } from '../hook';

interface NotificationItemProps {
  index: number;
  data: Notification;
}

const NotificationItem = ({ data }: NotificationItemProps) => {
  const [open, setOpen] = useState(false);

  const { unreadNotification, readNotification, deleteNotification } =
    useNotification();

  const color = TYPE_NOTIFICATION_COLOR_MAPPING[data.type] || 'text-gray-500';

  return (
    <div
      className={clsx(
        'relative group flex gap-3 p-3 rounded-lg transition-colors cursor-pointer my-2 items-start',
        data.isUnread
          ? 'bg-blue-50 dark:bg-[#3A3B3C]'
          : 'hover:bg-gray-100 dark:hover:bg-[#2F2F2F]',
      )}
      onClick={() => console.log('[NotificationItem]: ', data)}
    >
      {/* Icon */}
      <div className={clsx('flex-shrink-0 mt-1 size-8', color)}>
        <Icon
          className="text-xl size-8"
          icon={data.icon || 'mdi:bell-outline'}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-1 pr-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {data.name}
          </span>
          {data.isUnread && (
            <span className="size-2 rounded-full bg-blue-500" />
          )}
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {data.message}
        </p>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {dayjs(data.createdAt).fromNow()}
        </span>
      </div>

      {/* Nút 3 chấm (ẩn cho đến khi hover) */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dropdown isOpen={open} placement="bottom-end" onOpenChange={setOpen}>
          <DropdownTrigger>
            <Button
              isIconOnly
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              size="sm"
              variant="light"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon className="text-lg" icon="mdi:dots-horizontal" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Notification actions"
            onAction={(key) => {
              console.log(`[NotificationItem] Action: ${key}`);
              setOpen(false);
            }}
          >
            {!data.isUnread ? (
              <DropdownItem
                key="mark-unread"
                startContent={<Icon icon="mdi:email-outline" />}
              >
                Mark as unread
              </DropdownItem>
            ) : (
              <DropdownItem
                key="mark-read"
                startContent={<Icon icon="mdi:email-open-outline" />}
              >
                Mark as read
              </DropdownItem>
            )}
            <DropdownItem
              key="delete"
              className="text-red-500"
              startContent={<Icon icon="mdi:trash-can-outline" />}
            >
              Delete this notification
            </DropdownItem>
            <DropdownItem
              key="turnoff-everyone"
              startContent={<Icon icon="mdi:account-multiple-remove-outline" />}
            >
              Turn off @everyone notifications
            </DropdownItem>
            <DropdownItem
              key="turnoff-post"
              startContent={<Icon icon="mdi:bell-off-outline" />}
            >
              Turn off notifications for this post
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default NotificationItem;
