/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input } from '@heroui/react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { fakeChatRooms } from './config';
import ChatRoomItem from './ChatRoomItem';

import { SearchIcon } from '@/components/icons';
import { ChatRoom } from '@/interfaces/response';
import FallBack from '@/components/FallBack';

const ChatRoomList = () => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [selectedRoomId, setSelectedRoomId] = useState<string>();

  const [dataView, setDataView] = useState<ChatRoom[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isError] = useState<boolean>(false);

  const [isAtTop, setIsAtTop] = useState<boolean>(false);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const hasMore = useRef<boolean>(true);

  const querying = useRef<boolean>(false);

  const fetchCount = useRef<number>(20);

  const lastTime = useRef<Date | null>(null);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    setDataView(fakeChatRooms);
  }, []);

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) {
        return;
      }

      querying.current = true;
      setIsLoading(true);

      await new Promise((res) => setTimeout(res, 800));

      const data: ChatRoom[] = [];

      setDataView((prev) => [...data, ...prev]);

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

    setIsLoading(false);
    querying.current = false;
  };

  const handleScrollToTop = () => {
    virtuoso.current?.scrollToIndex({
      index: 0,
      align: 'start',
      behavior: 'smooth',
    });
  };

  let content: React.ReactNode;

  if (isError) {
    content = <FallBack type="error" />;
  } else if (!dataView.length && !isLoading) {
    content = <FallBack type="empty" />;
  } else {
    content = (
      <Virtuoso
        ref={virtuoso}
        atTopStateChange={(atTop) => setIsAtTop(!atTop)}
        className="h-full"
        data={dataView}
        endReached={requestData}
        itemContent={(index, item) => (
          <ChatRoomItem
            data={item}
            index={index}
            selectedId={selectedRoomId}
            onSelect={setSelectedRoomId}
          />
        )}
      />
    );
  }

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
              <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            labelPlacement="outside"
            placeholder="Search..."
            type="search"
            onBlur={toggleSearch}
            onFocus={toggleSearch}
          />
        </div>

        <div className="flex-1 flex flex-col gap-2 h-full relative">
          {content}
        </div>

        {isAtTop && (
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
