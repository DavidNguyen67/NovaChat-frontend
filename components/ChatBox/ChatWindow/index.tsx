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

import { useChatRoom } from '../hook';

import MessageItem from './MessageItem';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';

import { Message } from '@/interfaces/response';
import FallBack from '@/components/FallBack';

const ChatWindow = () => {
  const virtuoso = useRef<VirtuosoMessageListMethods<Message>>(null);

  const { messageList, chatRoom } = useChatRoom();

  const [dataView, setDataView] = useState<Message[]>([]);

  const saveLists = useRef<Message[]>([]);

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

      const data = await messageList.trigger({});

      if (data) {
        setDataView([...saveLists.current, ...data]);
        saveLists.current = [...saveLists.current, ...data];

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

  const handleScrollToBottom = () => {
    virtuoso.current?.scrollToItem({
      index: dataView.length - 1,
      align: 'end',
      behavior: 'smooth',
    });
  };

  const refreshData = () => {
    lastTime.current = null;
    hasMore.current = true;
    saveLists.current = [];
    requestData();
  };

  useEffect(() => {
    requestData();
  }, []);

  const renderContent = () => {
    if (!dataView.length) {
      if (messageList.error) {
        return <FallBack type="error" />;
      }
      if (!messageList.isMutating) {
        return <FallBack message="Try to chat something" type="empty" />;
      }
    } else {
      return (
        <VirtuosoMessageList<Message, null>
          ref={virtuoso}
          EmptyPlaceholder={() => <FallBack type="empty" />}
          Footer={() =>
            dataView.length &&
            messageList.isMutating && (
              <div className="py-3 text-center text-gray-500 dark:text-gray-400">
                <Spinner color="primary" size="sm" />
              </div>
            )
          }
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
  };

  return (
    <div className="relative flex flex-col w-full h-full border-default-200 text-white rounded-lg">
      {chatRoom?.data?.id ? (
        <>
          <ChatHeader />

          <VirtuosoMessageListLicense licenseKey="">
            <div className="p-2 flex-1 flex flex-col overflow-hidden">
              {renderContent()}
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
        </>
      ) : (
        <FallBack
          message="Choose a chat room to start chatting 💬"
          type="empty"
        />
      )}
    </div>
  );
};

export default ChatWindow;
