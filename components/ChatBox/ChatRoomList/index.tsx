/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input, Spinner } from '@heroui/react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useChatRoom } from '../hook';

import ChatRoomItem from './ChatRoomItem';

import { ChatRoom } from '@/interfaces/response';
import FallBack from '@/components/FallBack';

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

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) {
        return;
      }

      querying.current = true;

      const data = await chatRoomList.trigger({});

      setDataView((prev) => [...data, ...prev]);

      if (data) {
        setDataView([...saveLists.current, ...data]);
        saveLists.current = [...saveLists.current, ...data];

        if (data.length >= fetchCount.current) {
          hasMore.current = true;
          lastId.current = data[data.length - 1].id;
        } else {
          lastId.current = null;
          hasMore.current = false;
        }
      }
    } catch (error) {}

    querying.current = false;
  };

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
    requestData();
  };

  useEffect(() => {
    requestData();
  }, []);

  const renderContent = () => {
    if (!dataView.length) {
      if (chatRoomList.error) return <FallBack type="error" />;
      if (!chatRoomList.isMutating)
        return (
          <FallBack message="You don't have any chat rooms" type="empty" />
        );
    }

    return (
      <Virtuoso
        ref={virtuoso}
        atTopStateChange={(atTop) => setIsShowScrollToTop(!atTop)}
        components={{
          Footer: () =>
            dataView.length &&
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
    <div className="flex gap-2 w-100 p-4 border-r-2 border-default-200 relative">
      <div className="flex gap-4 flex-col w-full">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold">Chats</div>
          <div className="mx-auto" />
          <Button isIconOnly size="sm">
            <Icon className="text-xl" icon="entypo:new-message" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {isSearchOpen && (
            <Button isIconOnly size="sm" onPress={toggleSearch}>
              <Icon className="text-xl" icon="ion:arrow-back" />
            </Button>
          )}

          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: 'bg-default-100',
              input: 'text-sm',
            }}
            endContent={
              <Icon
                className="text-base text-default-400 pointer-events-none flex-shrink-0"
                icon="mdi:magnify"
              />
            }
            labelPlacement="outside"
            placeholder="Search..."
            type="search"
            onBlur={toggleSearch}
            onFocus={toggleSearch}
          />
        </div>

        <div className="flex-1 flex flex-col gap-2 h-full relative">
          {renderContent()}
        </div>

        {isShowScrollToTop && (
          <Button
            isIconOnly
            className="absolute bottom-[5.5rem] right-4 bg-green-500 hover:bg-green-600 text-white shadow-md rounded-full"
            size="sm"
            onPress={handleScrollToTop}
          >
            <Icon className="text-xl" icon="mdi:arrow-up" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
