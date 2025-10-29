/* eslint-disable prettier/prettier */
'use client';
import React, { useRef, useState } from 'react';
import {
  VirtuosoMessageList,
  VirtuosoMessageListLicense,
} from '@virtuoso.dev/message-list';
import { Spinner } from '@heroui/spinner';

import { fakeMessages } from './config';

import { Message } from '@/interfaces/response';
import FallBack from '@/components/FallBack';

const ChatWindow = () => {
  const virtuoso = useRef(null);
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const messages = fakeMessages;

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center h-full text-default-500 gap-3">
        <Spinner color="primary" label="Loading messages..." size="lg" />
      </div>
    );
  } else if (isError) {
    content = <FallBack type="error" />;
  } else if (!messages || messages.length === 0) {
    content = <FallBack type="empty" />;
  } else {
    content = (
      <VirtuosoMessageList<Message, null>
        ref={virtuoso}
        ItemContent={({ index }) => {
          const msg = messages[index];
          const isSelf = msg.senderId === 'you';

          return (
            <div
              className={`flex flex-col gap-1 py-1 ${
                isSelf ? 'items-end text-right' : 'items-start text-left'
              }`}
            >
              <span className="text-xs text-default-400">
                {isSelf ? 'You' : msg.senderId}
              </span>
              <div
                className={`rounded-xl px-3 py-2 max-w-[70%] ${
                  isSelf
                    ? 'bg-primary text-white'
                    : 'bg-default-100 text-default-800'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-2xs text-default-300">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        }}
        className="h-full"
        data={{
          data: messages,
        }}
      />
    );
  }

  return (
    <div className="flex gap-2 p-4 flex-1 flex-col h-full">
      <VirtuosoMessageListLicense licenseKey="">
        {content}
      </VirtuosoMessageListLicense>
    </div>
  );
};

export default ChatWindow;
