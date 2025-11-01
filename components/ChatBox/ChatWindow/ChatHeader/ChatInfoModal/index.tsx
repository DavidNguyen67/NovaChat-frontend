/* eslint-disable prettier/prettier */
import { Avatar, Button, Divider } from '@heroui/react';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';

import { useChatRoom } from '@/components/ChatBox/hook';
import { getUrlMedia } from '@/helpers';

dayjs.extend(relativeTime);

const ChatInfoModal = () => {
  const { chatRoom } = useChatRoom();

  const status = chatRoom.data?.isOnline
    ? 'Online'
    : chatRoom.data?.lastTimestamp
      ? `Active ${dayjs(chatRoom.data.lastTimestamp).fromNow()}`
      : '';

  return (
    <div className="flex flex-col gap-6 px-4 py-5 text-foreground">
      <div className="flex flex-col items-center gap-2 pb-4 border-b border-content2/30">
        <Avatar
          className="shadow-md"
          fallback={chatRoom.data?.name?.charAt(0)}
          radius="full"
          size="lg"
          src={getUrlMedia(chatRoom.data?.avatarUrl!)}
        />
        <div className="text-base font-semibold">{chatRoom.data?.name}</div>
        <div
          className={clsx('text-sm', {
            'text-green-500': chatRoom.data?.isOnline,
            'text-foreground/70': !chatRoom.data?.isOnline,
          })}
        >
          {status}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button
          className="bg-content2/40 text-foreground/90 hover:bg-content2/60"
          size="sm"
          variant="flat"
        >
          Profile
        </Button>
        <Button
          className="bg-content2/40 text-foreground/90 hover:bg-content2/60"
          size="sm"
          variant="flat"
        >
          Mute
        </Button>
        <Button
          className="bg-content2/40 text-foreground/90 hover:bg-content2/60"
          size="sm"
          variant="flat"
        >
          Search
        </Button>
      </div>

      <Divider className="bg-content2/30" />

      {/* Section: Media and Files */}
      <div className="space-y-3">
        <div className="font-semibold text-sm text-default-600">
          Media and Files
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="justify-start text-left text-sm text-foreground/90 hover:bg-content2/40"
            variant="light"
          >
            📷 Media
          </Button>
          <Button
            className="justify-start text-left text-sm text-foreground/90 hover:bg-content2/40"
            variant="light"
          >
            📁 Files
          </Button>
        </div>
      </div>

      <Divider className="bg-content2/30" />

      {/* Section: Privacy and Support */}
      <div className="space-y-3">
        <div className="font-semibold text-sm text-default-600">
          Privacy and Support
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="justify-start text-left text-sm text-foreground/90 hover:bg-content2/40"
            variant="light"
          >
            🔕 Mute notifications
          </Button>
          <Button
            className="justify-start text-left text-sm text-foreground/90 hover:bg-content2/40"
            variant="light"
          >
            🔒 Message permissions
          </Button>
          <Button
            className="justify-start text-left text-sm text-foreground/90 hover:bg-content2/40"
            variant="light"
          >
            ⏳ Disappearing messages
          </Button>
          <Button
            className="justify-start text-left text-sm text-foreground/90 hover:bg-content2/40"
            variant="light"
          >
            👁️ Read receipts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInfoModal;
