/* eslint-disable prettier/prettier */
import React from 'react';
import clsx from 'clsx';
import { Avatar } from '@heroui/react';

import { Message } from '@/interfaces/response';

interface MessageItemProps {
  index: number;
  data: Message;
  prevData: Message | null;
  nextData: Message | null;
}

const MessageItem = ({ data, prevData, nextData }: MessageItemProps) => {
  const msg = data;
  const isSelf = msg.senderId === 'you';

  return (
    <div
      className={clsx(
        'flex w-full',
        isSelf ? 'justify-end' : 'justify-start',
        'mb-1',
      )}
    >
      {!isSelf && (
        <div className="flex items-end gap-2 max-w-[80%]">
          {prevData?.senderId !== msg.senderId ? (
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src="https://i.pravatar.cc/150?img=32"
            />
          ) : (
            <div className="w-8" />
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
        <div className="flex items-end gap-2 max-w-[80%] flex-row-reverse">
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
