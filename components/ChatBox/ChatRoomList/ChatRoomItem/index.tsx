/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prettier/prettier */
'use client';
import React from 'react';
import { Avatar, Badge } from '@heroui/react';
import clsx from 'clsx';

import { useChatRoom } from '../../hook';

import { ChatRoom } from '@/interfaces/response';
import { getUrlMedia } from '@/helpers';

interface ChatRoomItemProps {
  index: number;
  data: ChatRoom;
}

const ChatRoomItem = (props: ChatRoomItemProps) => {
  const { chatRoom } = useChatRoom();

  const isSelected = chatRoom?.data?.id === props.data?.id;

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer',
        'hover:bg-default-100 active:scale-[0.99] my-1 mr-4',
        {
          'bg-primary-50 dark:bg-primary-900/20': isSelected,
        },
      )}
      onClick={() => chatRoom?.mutate(props?.data)}
    >
      <div className="relative">
        <Badge
          color="primary"
          content={
            props?.data?.unreadCount && props?.data?.unreadCount > 0
              ? props?.data?.unreadCount
              : undefined
          }
          isInvisible={!props?.data?.unreadCount}
          placement="top-right"
          shape="circle"
        >
          <Avatar
            fallback={props?.data?.name.charAt(0).toUpperCase()}
            radius="md"
            size="lg"
            src={getUrlMedia(props?.data?.avatarUrl!)}
          />
        </Badge>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm truncate text-foreground">
            {props?.data?.name}
          </span>
          <span className="text-[0.75rem] text-default-400">
            {new Date(props?.data?.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-default-500 text-sm truncate">
            {props?.data?.topic || props?.data?.description || 'No topic'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomItem;
