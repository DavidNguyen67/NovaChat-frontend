/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input, Spinner } from '@heroui/react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

import { useChatRoom } from '../hook';

import ChatRoomItem from './ChatRoomItem';
import ChatRoomSkeleton from './ChatRoomSkeletonItem';
import { mockChatRoomList } from './config';

import { ChatRoom } from '@/interfaces/response';
import FallBack from '@/components/FallBack';
import { useDebounceCallBack } from '@/hooks/useDebounceCallBack';

const ChatRoomList = () => {
  const { chatRoomList } = useChatRoom();

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [dataView, setDataView] = useState<ChatRoom[]>([]);

  const [isShowScrollToTop, setIsShowScrollToTop] = useState<boolean>(false);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const hasMore = useRef<boolean>(true);

  const querying = useRef<boolean>(false);

  const fetchCount = useRef<number>(20);

  const lastId = useRef<string | null>(null);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const saveLists = useRef<ChatRoom[]>([]);

  const searchKey = useRef('');

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) return;

      querying.current = true;
      // const data = await chatRoomList.trigger({
      //   fetchCount: fetchCount.current,
      //   ...(lastId.current ? { lastId: lastId.current } : {}),
      // });
      const data = mockChatRoomList(fetchCount.current);

      if (data) {
        const newData = [...saveLists.current, ...data];

        setDataView(newData);
        saveLists.current = newData;

        if (data.length >= fetchCount.current) {
          hasMore.current = true;
          lastId.current = data[data.length - 1].id;
        } else {
          lastId.current = null;
          hasMore.current = false;
        }
      }
    } finally {
      querying.current = false;
    }
  };

  const [searchValue, setSearchValue] = useState('');

  const debounceTime = useRef<number>(300);

  const handleScrollToTop = () => {
    virtuoso.current?.scrollToIndex({
      index: 0,
      align: 'start',
      behavior: 'smooth',
    });
  };

  const refreshData = () => {
    lastId.current = null;
    hasMore.current = true;
    saveLists.current = [];
    setDataView([]);
    requestData();
  };

  const debounceSearch = useDebounceCallBack(
    () => refreshData(),
    debounceTime.current,
  );

  useEffect(() => {
    debounceSearch();
  }, [searchValue]);

  const renderContent = () => {
    if (!dataView.length) {
      if (chatRoomList.isMutating)
        return (
          <div className="flex flex-col gap-2 px-2">
            {Array.from({ length: 10 }).map((_, idx) => (
              <ChatRoomSkeleton key={idx} />
            ))}
          </div>
        );
      else {
        if (chatRoomList.error)
          return (
            <FallBack
              error={chatRoomList.error}
              type="error"
              onRetry={refreshData}
            />
          );

        return (
          <FallBack message="You don't have any chat rooms" type="empty" />
        );
      }
    }

    return (
      <Virtuoso
        ref={virtuoso}
        atTopStateChange={(atTop) => setIsShowScrollToTop(!atTop)}
        components={{
          Footer: () =>
            Boolean(dataView.length) &&
            chatRoomList.isMutating && (
              <div className="py-3 text-center text-gray-500 dark:text-gray-400">
                <Spinner color="primary" size="sm" />
              </div>
            ),
        }}
        data={dataView}
        endReached={requestData}
        itemContent={(index, item) => (
          <ChatRoomItem data={item} index={index} />
        )}
      />
    );
  };

  return (
    <div className=" flex flex-col gap-4 w-100 p-4 relative pl-0 border-r border-white/30 dark:border-white/10 bg-white/60 dark:bg-white/10 backdrop-blur-md shadow-sm transition-all duration-300 pr-0">
      <div className="flex items-center gap-2 mx-4">
        <h2 className="text-lg font-semibold flex items-center gap-1 text-gray-800 dark:text-gray-100">
          💬 Chats
        </h2>
        <div className="flex-grow" />
        <Button
          isIconOnly
          aria-label="New message"
          className="bg-white/60 dark:bg-white/10 text-gray-700 dark:text-gray-100 hover:scale-105 transition-transform"
          size="sm"
          variant="flat"
        >
          <Icon className="text-xl" icon="entypo:new-message" />
        </Button>
      </div>

      <div className="flex items-center gap-2 relative overflow-hidden mx-4">
        <AnimatePresence initial={false} mode="popLayout">
          {isSearchOpen && (
            <motion.div
              key="back"
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              initial={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                isIconOnly
                className="bg-white/40 dark:bg-white/10 text-gray-700 dark:text-gray-200"
                size="sm"
                variant="light"
                onPress={toggleSearch}
              >
                <Icon className="text-xl" icon="ion:arrow-back" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key="search"
          animate={{ width: '100%' }}
          className="flex-1"
          exit={{ width: 0 }}
          initial={{ width: isSearchOpen ? 0 : '100%' }}
          transition={{ duration: 0.3 }}
        >
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper:
                'bg-white/60 dark:bg-white/10 rounded-xl backdrop-blur-md border-none text-gray-700 dark:text-gray-200 transition-all duration-200',
              input:
                'text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400',
            }}
            endContent={
              <Icon
                className="text-base text-default-400 pointer-events-none flex-shrink-0"
                icon="mdi:magnify"
              />
            }
            placeholder="Search..."
            type="search"
            value={searchValue}
            onBlur={() => {
              if (searchValue) {
                debounceSearch();
              }
            }}
            onChange={(e) => {
              searchKey.current = e.target.value;
              setSearchValue(e.target.value);
              debounceSearch();
            }}
            onFocus={() => !isSearchOpen && toggleSearch()}
          />
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 h-full relative text-gray-800 dark:text-gray-100">
        {renderContent()}

        <AnimatePresence>
          {isShowScrollToTop && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 right-4"
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                isIconOnly
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-transform"
                size="sm"
                onPress={handleScrollToTop}
              >
                <Icon className="text-xl" icon="mdi:arrow-up" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatRoomList;
