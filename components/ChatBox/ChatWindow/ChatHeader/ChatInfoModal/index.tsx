/* eslint-disable prettier/prettier */
import { Avatar, Button } from '@heroui/react';
import React from 'react';
import dayjs from 'dayjs';

import { useChatRoom } from '@/components/ChatBox/hook';
import { getUrlMedia } from '@/helpers';

const ChatInfoModal = () => {
  const { chatRoom } = useChatRoom();

  const status = chatRoom.data?.isOnline
    ? 'Online'
    : chatRoom.data?.lastTimestamp
      ? `Active ${dayjs(chatRoom.data.lastTimestamp).fromNow()}`
      : '';

  return (
    <>
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-2 py-4 border-b border-gray-700">
        <Avatar
          fallback={chatRoom.data?.name?.charAt(0)}
          radius="full"
          size="lg"
          src={getUrlMedia(chatRoom.data?.avatarUrl!)}
        />
        <div className="text-base font-medium">{chatRoom.data?.name}</div>
        <div className="text-sm text-gray-400">{status}</div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <Button className="bg-gray-700 text-white" size="sm" variant="flat">
          Profile
        </Button>
        <Button className="bg-gray-700 text-white" size="sm" variant="flat">
          Mute
        </Button>
        <Button className="bg-gray-700 text-white" size="sm" variant="flat">
          Search
        </Button>
      </div>

      {/* Section: Media and Files */}
      <div>
        <div className="font-semibold mb-2">Media and Files</div>
        <div className="flex flex-col gap-2">
          <Button className="justify-start text-left" variant="light">
            📷 Media
          </Button>
          <Button className="justify-start text-left" variant="light">
            📁 Files
          </Button>
        </div>
      </div>

      {/* Section: Privacy and Support */}
      <div>
        <div className="font-semibold mb-2">Privacy and Support</div>
        <div className="flex flex-col gap-2">
          <Button className="justify-start text-left" variant="light">
            🔕 Mute notifications
          </Button>
          <Button className="justify-start text-left" variant="light">
            🔒 Message permissions
          </Button>
          <Button className="justify-start text-left" variant="light">
            ⏳ Disappearing messages
          </Button>
          <Button className="justify-start text-left" variant="light">
            👁️ Read receipts
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatInfoModal;
