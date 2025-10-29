/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';

import { useChatRoom } from '../../hook';

import ChatInfoModal from './ChatInfoModal';

import { useModal } from '@/hooks/useModal';
import { getUrlMedia } from '@/helpers';

const ChatHeader = () => {
  const moreOptionModal = useModal();

  const { chatRoom } = useChatRoom();

  const status = chatRoom.data?.isOnline
    ? 'Online'
    : chatRoom.data?.lastTimestamp
      ? `Active ${dayjs(chatRoom.data.lastTimestamp).fromNow()}`
      : '';

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 rounded-t-lg text-black p-4 border-b border-default-200">
        <div className="flex items-center gap-3">
          <Avatar
            isBordered
            className="mt-[1px]"
            fallback={chatRoom.data?.name?.charAt(0)}
            radius="full"
            size="md"
            src={getUrlMedia(chatRoom.data?.avatarUrl!)}
          />

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-[15px] text-foreground">
              {chatRoom.data?.name}
            </span>
            <span className="text-xs text-green-400">{status}</span>
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

          <Button
            isIconOnly
            size="sm"
            onPress={() => moreOptionModal.handleShow()}
          >
            <Icon className="text-xl" icon="mdi:dots-horizontal" />
          </Button>
        </div>
      </div>
      <Modal
        isOpen={moreOptionModal.isOpen}
        onOpenChange={moreOptionModal.onChangeOpen}
      >
        <ModalContent className="bg-[#1e1f22] text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold">
                Chat Info
              </ModalHeader>

              <ModalBody className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                <ChatInfoModal />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatHeader;
