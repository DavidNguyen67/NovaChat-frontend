/* eslint-disable prettier/prettier */
import React from 'react';
import clsx from 'clsx';
import { Avatar } from '@heroui/react';

import { useChatRoom } from '../../hook';

import { Message } from '@/interfaces/response';
import { getUrlMedia } from '@/helpers';

interface MessageItemProps {
  index: number;
  data: Message;
  prevData: Message | null;
  nextData: Message | null;
}

const MessageItem = ({ data, prevData, nextData }: MessageItemProps) => {
  const msg = data;
  const isSelf = msg.senderId === 'you';

  const { chatRoom } = useChatRoom();

  return (
    <div
      className={clsx(
        'flex w-full',
        isSelf ? 'justify-end' : 'justify-start',
        prevData?.senderId !== msg.senderId && 'mt-4',
        prevData?.senderId === msg.senderId && 'mt-1',
      )}
    >
      {!isSelf && (
        <div className="flex items-end gap-2 max-w-[80%]">
          {prevData?.senderId !== msg.senderId ? (
            <div className="w-10">
              <Avatar
                className="ml-2"
                fallback={chatRoom.data?.name?.charAt(0)}
                radius="full"
                size="sm"
                src={getUrlMedia(chatRoom.data?.avatarUrl!)}
              />
            </div>
          ) : (
            <div className="w-10" />
          )}
          <div
            className={clsx(
              'rounded-2xl px-4 py-2 text-[15px] leading-[1.4] break-words shadow-sm',
              'bg-[#2F2F2F] text-white',
            )}
            style={{
              borderBottomLeftRadius:
                nextData?.senderId === msg.senderId ? '0.5rem' : '1rem',
            }}
          >
            {msg.content}
          </div>
        </div>
      )}

      {isSelf && (
        <div className="flex items-end gap-2 max-w-[60%] flex-row-reverse">
          <div
            className={clsx(
              'rounded-2xl px-4 py-2 text-[15px] leading-[1.4] break-words shadow-sm',
              'bg-green-500 text-white',
            )}
            style={{
              borderBottomRightRadius:
                nextData?.senderId === msg.senderId ? '0.5rem' : '1rem',
            }}
          >
            {msg.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
