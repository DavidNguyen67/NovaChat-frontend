/* eslint-disable prettier/prettier */
'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button, Input } from '@heroui/react';

import { SearchIcon } from '@/components/icons';

const ChatHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
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

      <div className="flex-1 flex flex-col gap-2">
        {/* <Listbox isVirtualized className="max-w-xs">
          <ListboxItem>ad</ListboxItem>
        </Listbox> */}
      </div>
    </div>
  );
};

export default ChatHeader;
