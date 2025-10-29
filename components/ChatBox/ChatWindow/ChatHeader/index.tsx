/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import { Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-t-lg text-black p-4 border-b border-default-200">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3">
        <Avatar
          isBordered
          className="mt-[1px]"
          fallback="h"
          radius="full"
          size="md"
          src="https://i.pravatar.cc/150?img=32"
        />

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-[15px] text-foreground">
            Haha
          </span>
          <span className="text-xs text-green-400">Active now</span>
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <Button isIconOnly size="sm">
          <Icon className="text-xl" icon="ph:phone-fill" />
        </Button>

        <Button isIconOnly size="sm">
          <Icon className="text-xl" icon="ph:video-camera-fill" />
        </Button>

        <Button isIconOnly size="sm">
          <Icon className="text-xl" icon="entypo:new-message" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
