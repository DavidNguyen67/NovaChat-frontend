/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  ListScrollLocation,
  VirtuosoMessageList,
  VirtuosoMessageListLicense,
  VirtuosoMessageListMethods,
} from '@virtuoso.dev/message-list';
import { Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

import { fakeMessages } from './config';
import MessageItem from './MessageItem';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';

import { Message } from '@/interfaces/response';
import FallBack from '@/components/FallBack';

const ChatWindow = () => {
  const virtuoso = useRef<VirtuosoMessageListMethods<Message>>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isError] = useState<boolean>(false);

  const [dataView, setDataView] = useState<Message[]>(fakeMessages);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const hasMore = useRef<boolean>(true);

  const lastTime = useRef<Date | null>(null);

  const querying = useRef<boolean>(false);

  const fetchCount = useRef<number>(20);

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) {
        return;
      }
      querying.current = true;

      const data: Message[] = [];

      if (data) {
        if (data.length >= fetchCount.current) {
          hasMore.current = true;
          lastTime.current = data[data.length - 1].createdAt;
        } else {
          lastTime.current = null;
          hasMore.current = false;
        }
      }
    } catch (error) {}

    querying.current = false;
  };

  const onScroll = ({ listOffset, bottomOffset }: ListScrollLocation) => {
    if (listOffset > -50) {
      requestData();
    }
    if (bottomOffset > 50) {
      isAtBottom && setIsAtBottom(false);
    } else {
      !isAtBottom && setIsAtBottom(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTyping(Math.random() > 0.7);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleScrollToBottom = () => {
    virtuoso.current?.scrollToItem({
      index: dataView.length - 1,
      align: 'end',
      behavior: 'smooth',
    });
  };

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center h-full text-default-500 gap-3">
        <Spinner color="primary" label="Loading messages..." size="lg" />
      </div>
    );
  } else if (isError) {
    content = <FallBack type="error" />;
  } else {
    content = (
      <VirtuosoMessageList<Message, null>
        ref={virtuoso}
        EmptyPlaceholder={() => <FallBack type="empty" />}
        ItemContent={MessageItem}
        className="h-full w-full"
        data={{
          data: dataView,
          scrollModifier: isAtBottom
            ? { type: 'auto-scroll-to-bottom', autoScroll: 'smooth' }
            : null,
        }}
        initialLocation={{ index: dataView.length - 1, align: 'end' }}
        onScroll={onScroll}
      />
    );
  }

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0E0E0F] text-white rounded-lg">
      <ChatHeader />

      <VirtuosoMessageListLicense licenseKey="">
        <div className="p-2 flex-1 flex flex-col overflow-hidden">
          {content}
        </div>
      </VirtuosoMessageListLicense>

      {isTyping && (
        <div className="flex items-center gap-2 text-sm text-gray-400 px-5 pb-2">
          <Icon className="animate-spin" icon="mdi:loading" />
          <span>Someone is typing...</span>
        </div>
      )}

      {!isAtBottom && (
        <Button
          isIconOnly
          className="absolute bottom-[5.5rem] right-4 bg-green-500 hover:bg-green-600 text-white shadow-md rounded-full"
          size="sm"
          onPress={handleScrollToBottom}
        >
          <Icon className="text-xl" icon="mdi:arrow-down" />
        </Button>
      )}

      <ChatInput />
    </div>
  );
};

export default ChatWindow;
