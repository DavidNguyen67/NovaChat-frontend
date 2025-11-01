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
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

import { useChatRoom } from '../hook';

import MessageItem from './MessageItem';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { seedMessages } from './config';

import { Message } from '@/interfaces/response';
import FallBack from '@/components/FallBack';
import { useAccount } from '@/hooks/auth/useAccount';

const ChatWindow = () => {
  const virtuoso = useRef<VirtuosoMessageListMethods<Message>>(null);

  const { accountInfo } = useAccount();

  const { messageList, chatRoom } = useChatRoom();

  const memberIds: string[] = [
    accountInfo?.data?.id ?? '',
    ...(chatRoom.data?.memberIds ?? []),
  ];

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

      // const data = await messageList.trigger({
      //   ...(lastTime.current ? { lastTime: lastTime.current } : {}),
      //   ...(fetchCount.current ? { fetchCount: fetchCount.current } : {}),
      // });

      const data = seedMessages(
        chatRoom.data ? [chatRoom.data.id] : [],
        memberIds,
        fetchCount.current,
      );

      if (data) {
        setDataView([...data, ...saveLists.current]);
        saveLists.current = [...data, ...saveLists.current];

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
    refreshData();
  }, [chatRoom?.data?.id]);

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
            Boolean(dataView.length) &&
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

  const isActive = Boolean(chatRoom?.data?.id);

  console.log('Check dataView:', { dataView, userId: accountInfo.data?.id });

  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'relative flex flex-col w-full h-full rounded-2xl overflow-hidden border border-white/10 dark:border-white/5 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl shadow-lg transition-all duration-300',
      )}
      initial={{ opacity: 0, y: 10 }}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="chat-content"
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col flex-1 h-full"
            exit={{ opacity: 0, scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            <ChatHeader />

            <VirtuosoMessageListLicense licenseKey="">
              <div className="p-2 flex-1 flex flex-col overflow-hidden h-full">
                {renderContent()}
              </div>
            </VirtuosoMessageListLicense>

            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-default-500 px-5 pb-2">
                <Icon className="animate-spin" icon="mdi:loading" />
                <span>Someone is typing...</span>
              </div>
            )}

            {!isAtBottom && (
              <Button
                isIconOnly
                className="absolute bottom-[5.5rem] right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md rounded-full hover:scale-105 transition-transform"
                size="sm"
                onPress={handleScrollToBottom}
              >
                <Icon className="text-xl" icon="mdi:arrow-down" />
              </Button>
            )}

            <ChatInput />
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center flex-1 text-center px-8"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 10 }}
          >
            <FallBack
              message={
                <span>
                  Choose a chat room to start chatting{' '}
                  <span className="text-2xl">💬</span>
                </span>
              }
              type="empty"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatWindow;
