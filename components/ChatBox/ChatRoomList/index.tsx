/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input, Spinner } from '@heroui/react';
import {
  VirtuosoMessageList,
  VirtuosoMessageListLicense,
  VirtuosoMessageListMethods,
} from '@virtuoso.dev/message-list';

import { fakeChatRooms } from './config';
import ChatRoomItem from './ChatRoomItem';

import { SearchIcon } from '@/components/icons';
import { ChatRoom } from '@/interfaces/response';
import FallBack from '@/components/FallBack';

const ChatRoomList = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(
    undefined,
  );

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    setChatRooms(fakeChatRooms);
  }, []);

  const virtuoso = useRef<VirtuosoMessageListMethods<ChatRoom>>(null);

  const [isLoading] = useState(false);

  const [isError] = useState(false);

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center h-full text-default-500 gap-3">
        <Spinner color="primary" label="Loading messages..." size="lg" />
      </div>
    );
  } else if (isError) {
    content = <FallBack type="error" />;
  } else if (!chatRooms || chatRooms.length === 0) {
    content = <FallBack type="empty" />;
  } else {
    content = (
      <VirtuosoMessageList<ChatRoom, null>
        ref={virtuoso}
        ItemContent={(props) => (
          <ChatRoomItem
            {...props}
            selectedId={selectedRoomId}
            onSelect={(id) => setSelectedRoomId(id)}
          />
        )}
        className="h-full"
        data={{
          data: chatRooms,
        }}
      />
    );
  }

  return (
    <div className="flex gap-2 w-100 p-4 border-r-2 border-default-200">
      <div className="flex gap-4 flex-col w-full">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold">Chats</div>

          <div className="mx-auto" />

          <Button isIconOnly>
            <Icon className="text-xl" icon="entypo:new-message" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {isSearchOpen && (
            <Button isIconOnly onPress={toggleSearch}>
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

        <div className="flex-1 flex flex-col gap-2 h-full overflow-y-auto">
          <VirtuosoMessageListLicense licenseKey="">
            {content}
          </VirtuosoMessageListLicense>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;
