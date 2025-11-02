/* eslint-disable prettier/prettier */
'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { Avatar, Badge } from '@heroui/react';
import clsx from 'clsx';

import { useChatRoom } from '../../hook';

import { ChatRoom } from '@/interfaces/response';
import { getUrlMedia } from '@/helpers';

interface ChatRoomItemProps {
  index: number;
  data: ChatRoom;
  className?: string;
}

const ChatRoomItem = (props: ChatRoomItemProps) => {
  const { chatRoom } = useChatRoom();

  const isSelected = chatRoom?.data?.id === props.data?.id;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-2xl cursor-pointer select-none transition-all duration-300 mb-1.5 mr-2 ml-4',
        'hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-900',
        isSelected
          ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-400/30'
          : 'bg-white/40 dark:bg-gray-800/40 border border-white/10 backdrop-blur-md',
        props.className,
      )}
      initial={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => chatRoom?.mutate(props.data)}
    >
      <div className="relative shrink-0 size-14">
        <Badge
          color="primary"
          content={
            props.data?.unreadCount && props.data?.unreadCount > 0
              ? props.data.unreadCount
              : undefined
          }
          isInvisible={!props.data?.unreadCount}
          placement="top-right"
          shape="circle"
        >
          <Avatar
            className={clsx(
              'transition-all ring-2 size-14',
              isSelected
                ? 'ring-blue-500/60 dark:ring-blue-400/50'
                : 'ring-transparent hover:ring-primary/40',
            )}
            fallback={props.data?.name?.charAt(0)?.toUpperCase()}
            radius="md"
            size="lg"
            src={getUrlMedia(props.data?.avatarUrl!)}
          />
        </Badge>

        {props.data?.isOnline && (
          <span className="absolute bottom-0 right-0 block size-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className={clsx(
              'font-semibold text-sm truncate transition-colors',
              isSelected
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-foreground',
            )}
          >
            {props.data?.name}
          </span>

          <span className="text-[0.75rem] text-default-400">
            {new Date(
              props.data?.lastTimestamp ?? props.data?.createdAt,
            ).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <p
          className={clsx(
            'text-sm truncate mt-1 transition-colors text-left',
            isSelected ? 'text-default-600' : 'text-default-500',
          )}
        >
          {props.data?.topic || props.data?.description || 'No topic'}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatRoomItem;
