/* eslint-disable prettier/prettier */
'use client';
import { Button, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';

const ChatInput = () => {
  const [message, setMessage] = useState<string>('');

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-default-200 rounded-b-lg mt-auto">
      <div className="flex items-center gap-3">
        <Icon className="text-2xl cursor-pointer" icon="mdi:microphone" />
        <Icon className="text-2xl cursor-pointer" icon="mdi:image-outline" />
        <Icon className="text-2xl cursor-pointer" icon="mdi:sticker-emoji" />
        <Icon className="text-2xl cursor-pointer" icon="mdi:gif" />
      </div>

      <Input
        classNames={{
          inputWrapper:
            'bg-[#2A2B2D] rounded-full text-white focus:ring-0 border-none shadow-none',
          input: 'text-white placeholder:text-gray-400',
        }}
        placeholder="Aa"
        value={message}
        variant="flat"
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex items-center gap-3">
        <Icon
          className="text-2xl cursor-pointer hover:opacity-80"
          icon="mdi:emoticon-outline"
        />
        <Button isIconOnly className="bg-transparent" radius="full">
          <Icon className="text-2xl" icon="mdi:thumb-up" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
