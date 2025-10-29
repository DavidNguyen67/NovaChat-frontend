/* eslint-disable prettier/prettier */
'use client';
import React, { useRef, useState } from 'react';
import {
  VirtuosoMessageList,
  VirtuosoMessageListLicense,
} from '@virtuoso.dev/message-list';
import { Spinner } from '@heroui/spinner';

import { fakeMessages } from './config';
import MessageItem from './MessageItem';
import ChatHeader from './ChatHeader';

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
        ItemContent={(props) => <MessageItem {...props} />}
        className="h-full w-full"
        data={{
          data: messages,
        }}
      />
    );
  }

  return (
    <div className="flex gap-4 flex-col w-full h-full">
      <ChatHeader />
      <VirtuosoMessageListLicense licenseKey="">
        <div className="p-2 flex-1 h-full flex flex-col">{content}</div>
      </VirtuosoMessageListLicense>
    </div>
  );
};

export default ChatWindow;
