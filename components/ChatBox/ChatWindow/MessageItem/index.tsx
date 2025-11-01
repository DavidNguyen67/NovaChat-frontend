/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import clsx from 'clsx';
import { Avatar, Checkbox } from '@heroui/react';
import { motion } from 'framer-motion';

import { useChatRoom } from '../../hook';

import { MessageActions } from './MessageActions';

import { useAccount } from '@/hooks/auth/useAccount';
import { getUrlMedia } from '@/helpers';
import { Message } from '@/interfaces/response';

interface MessageItemProps {
  index: number;
  data: Message;
  prevData: Message | null;
  nextData: Message | null;
}

const MessageItem = ({ data, nextData }: MessageItemProps) => {
  const msg = data;

  const { accountInfo } = useAccount();

  const { chatRoom, deleteMode, handleSelectDeleteMessage } = useChatRoom();

  const isSelf = msg.sender?.id === accountInfo.data?.id;

  const showAvatar = nextData?.sender?.id !== msg.sender?.id;

  const [hovered, setHovered] = useState(false);

  const isSelected = deleteMode?.data?.selectedMessages?.some(
    (m) => m.id === msg.id,
  );

  const isDeleteMode = deleteMode?.data?.isDeleteMode;

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        scale: isSelected ? 0.97 : 1,
      }}
      className={clsx(
        'flex w-full px-6 group relative transition-all duration-200',
        isSelf ? 'justify-end' : 'justify-start',
        showAvatar ? 'mt-4' : 'mt-1',
        isDeleteMode && 'cursor-pointer select-none',
      )}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      onClick={() => handleSelectDeleteMessage(msg)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isDeleteMode && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className={clsx(
            'absolute -left-4 top-1/2 -translate-y-1/2 z-10',
            isSelf && 'left-auto -right-1.5',
          )}
          exit={{ opacity: 0, scale: 0.8 }}
          initial={{ opacity: 0, scale: 0.8 }}
        >
          <Checkbox
            classNames={{
              base: 'scale-90',
              icon: 'text-white',
            }}
            color="danger"
            isSelected={isSelected}
            radius="full"
            size="sm"
          />
        </motion.div>
      )}

      {!isSelf && (
        <div className="flex items-end gap-3 max-w-[80%] relative">
          {showAvatar ? (
            <div className="size-8 flex items-center justify-center object-center">
              <Avatar
                className="size-8 shadow-sm"
                fallback={chatRoom.data?.name?.charAt(0) ?? '?'}
                radius="full"
                src={getUrlMedia(msg.sender?.avatarUrl!)}
              />
            </div>
          ) : (
            <div className="size-8" />
          )}

          <div
            className={clsx(
              'relative rounded-2xl px-4 py-2 text-[15px] leading-[1.45] break-words shadow-sm transition-all duration-200 text-left',
              'bg-content1 text-foreground/90 dark:bg-gray-800 dark:text-gray-100',
              isSelected && 'ring-2 ring-danger/70 bg-danger/10 scale-[0.98]',
            )}
            style={{
              borderBottomLeftRadius:
                nextData?.sender === msg.sender ? '0.5rem' : '1rem',
            }}
          >
            {msg.content}
            {!isDeleteMode && <MessageActions msg={msg} show={hovered} />}
          </div>
        </div>
      )}

      {isSelf && (
        <div className="flex items-end gap-2 max-w-[70%] flex-row-reverse relative">
          <div
            className={clsx(
              'relative rounded-2xl px-4 py-2 text-[15px] leading-[1.45] break-words shadow-sm transition-all duration-200 text-left',
              'bg-gradient-to-br from-blue-500 to-purple-500 text-white dark:from-blue-600 dark:to-purple-600',
              isSelected && 'ring-2 ring-danger/70 scale-[0.98]',
            )}
            style={{
              borderBottomRightRadius:
                nextData?.sender === msg.sender ? '0.5rem' : '1rem',
            }}
          >
            {msg.content}
            {!isDeleteMode && (
              <MessageActions isSelf msg={msg} show={hovered} />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MessageItem;
