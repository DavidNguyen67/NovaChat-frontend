/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import './style.scss';
import { useChatRoom } from '../hook';

import MessageItem from './MessageItem';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageSkeleton from './MessageSkeleton';
import { seedMessages } from './config';

import { Message } from '@/interfaces/response';
import FallBack from '@/components/FallBack';
import { useAccount } from '@/hooks/auth/useAccount';

const ChatWindow = () => {
  const virtuoso = useRef<VirtuosoHandle | null>(null);

  const { accountInfo } = useAccount();

  const {
    messageList,
    chatRoom,
    selectedMode,
    handleResetSelectMode,
    openSelectModal,
  } = useChatRoom();

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

  const fetchCount = useRef<number>(
    parseInt(process.env.NEXT_PUBLIC_FETCH_COUNT!) ?? 30,
  );

  console.log('Check dataView:', dataView);

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) return;
      querying.current = true;

      const virtuosoEl = document.querySelector('.chat-window-virtuoso');

      const prevScrollHeight = virtuosoEl?.scrollHeight ?? 0;
      const prevScrollTop = virtuosoEl?.scrollTop ?? 0;

      const data = seedMessages(
        chatRoom.data ? [chatRoom.data.id] : [],
        memberIds,
        saveLists.current?.length,
        fetchCount.current,
      );

      if (data && data.length > 0) {
        saveLists.current = [...data, ...saveLists.current];
        setDataView([...saveLists.current]);

        requestAnimationFrame(() => {
          const newScrollHeight = virtuosoEl?.scrollHeight ?? 0;
          const delta = newScrollHeight - prevScrollHeight;

          if (virtuosoEl) {
            virtuosoEl.scrollTop = prevScrollTop + delta;
          }
        });

        if (data.length >= fetchCount.current) {
          hasMore.current = true;
          lastTime.current = data[data.length - 1].createdAt;
        } else {
          lastTime.current = null;
          hasMore.current = false;
        }
      } else {
        hasMore.current = false;
      }
    } catch (err) {
      console.error('requestData error:', err);
    } finally {
      querying.current = false;
    }
  };

  const scrollToBottom = () => {
    virtuoso.current?.scrollToIndex({
      index: dataView.length - 1,
      align: 'end',
      behavior: 'smooth',
    });
  };

  const refreshData = async () => {
    lastTime.current = null;
    hasMore.current = true;
    saveLists.current = [];
    setDataView([]);
    await requestData();
    setTimeout(() => {
      scrollToBottom();
    }, 400);
  };

  useEffect(() => {
    refreshData();
  }, [chatRoom?.data?.id]);

  const renderContent = () => {
    if (!dataView.length) {
      if (messageList.isMutating) {
        return (
          <div className="flex flex-col overflow-y-auto">
            {Array.from({ length: 20 }).map((_, i) => (
              <MessageSkeleton key={i} isSelf={i % 2 === 0} />
            ))}
          </div>
        );
      } else {
        if (messageList.error)
          return (
            <FallBack
              error={messageList.error}
              type="error"
              onRetry={refreshData}
            />
          );

        return <FallBack message="You don't have any messages" type="empty" />;
      }
    }

    return (
      <Virtuoso<Message>
        ref={virtuoso}
        atBottomThreshold={50}
        className="h-full w-full overflow-x-hidden chat-window-virtuoso"
        components={{
          EmptyPlaceholder: () => <FallBack type="empty" />,
          Header: () =>
            Boolean(dataView.length) && messageList.isMutating ? (
              <div className="py-3 text-center text-gray-500 dark:text-gray-400">
                <Spinner color="primary" size="sm" />
              </div>
            ) : null,
        }}
        computeItemKey={(_, item) => item.id}
        data={dataView}
        followOutput={isAtBottom ? 'smooth' : false}
        increaseViewportBy={{
          bottom: 100,
          top: 100,
        }}
        initialTopMostItemIndex={dataView.length - 1}
        itemContent={(index, item) => {
          const prevData = dataView[index - 1];
          const nextData = dataView[index + 1];

          return (
            <MessageItem
              key={item.id}
              data={item}
              nextData={nextData}
              prevData={prevData}
            />
          );
        }}
        rangeChanged={(range) => {
          if (range.endIndex >= dataView.length - 1) {
            setIsAtBottom(true);
          }
          if (range.startIndex < 10) {
            requestData();
          }
        }}
      />
    );
  };

  const isActive = Boolean(chatRoom?.data?.id);

  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'relative flex flex-col w-full h-full rounded-tr-2xl rounded-br-2xl overflow-hidden border border-white/10 dark:border-white/5 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl shadow-lg transition-all duration-300',
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

            <div className="py-2 flex-1 flex flex-col overflow-hidden h-full">
              {renderContent()}
            </div>
            {selectedMode?.data?.isSelectMode && (
              <AnimatePresence>
                {selectedMode?.data?.selectedMessages?.length > 0 && (
                  <motion.div
                    key="delete-toolbar"
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <Card
                      className={clsx(
                        'px-5 py-2 flex flex-row items-center gap-4 rounded-full backdrop-blur-md',
                        'bg-background/90 border border-content2/30',
                      )}
                      shadow="lg"
                    >
                      <span className="text-sm text-default-500 flex items-center gap-1">
                        <span className="font-semibold text-foreground">
                          {selectedMode?.data?.selectedMessages?.length}{' '}
                        </span>
                        selected
                      </span>

                      <Divider
                        className="h-5 bg-default-300/40"
                        orientation="vertical"
                      />

                      {(selectedMode?.data?.mode === 'unknown' ||
                        selectedMode?.data?.mode === 'forward') && (
                        <Button
                          className="font-medium hover:scale-105 transition-transform"
                          color="primary"
                          size="sm"
                          startContent={
                            <Icon
                              className="text-lg"
                              icon="mdi:forward-outline"
                            />
                          }
                          variant="flat"
                          onPress={() =>
                            openSelectModal(
                              selectedMode?.data?.mode === 'unknown'
                                ? 'unknown'
                                : 'forward',
                            )
                          }
                        >
                          Forward
                        </Button>
                      )}
                      {(selectedMode?.data?.mode === 'unknown' ||
                        selectedMode?.data?.mode === 'delete') && (
                        <Button
                          className="font-medium hover:scale-105 transition-transform"
                          color="danger"
                          size="sm"
                          startContent={
                            <Icon
                              className="text-lg"
                              icon="mdi:delete-outline"
                            />
                          }
                          variant="flat"
                          onPress={() =>
                            openSelectModal(
                              selectedMode?.data?.mode === 'unknown'
                                ? 'unknown'
                                : 'delete',
                            )
                          }
                        >
                          Delete
                        </Button>
                      )}

                      <Divider
                        className="h-5 bg-default-300/40"
                        orientation="vertical"
                      />

                      <Button
                        className="text-default-500 hover:text-foreground hover:scale-105 transition-transform"
                        color="default"
                        size="sm"
                        variant="light"
                        onPress={handleResetSelectMode}
                      >
                        Cancel
                      </Button>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-default-500 px-5 pb-2">
                <Icon className="animate-spin" icon="mdi:loading" />
                <span>Someone is typing...</span>
              </div>
            )}

            {!isAtBottom && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-24 right-4"
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  isIconOnly
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-transform"
                  size="sm"
                  onPress={scrollToBottom}
                >
                  <Icon className="text-xl" icon="mdi:arrow-down" />
                </Button>
              </motion.div>
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
