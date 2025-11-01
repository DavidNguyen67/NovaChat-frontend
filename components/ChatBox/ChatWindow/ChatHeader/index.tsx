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
  Tooltip,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { useChatRoom } from '../../hook';

import ChatInfoModal from './ChatInfoModal';

import { useModal } from '@/hooks/useModal';
import { getUrlMedia } from '@/helpers';

const ChatHeader = () => {
  const moreOptionModal = useModal();
  const { chatRoom, selectedMode } = useChatRoom();

  const status = chatRoom.data?.isOnline
    ? 'Online'
    : chatRoom.data?.lastTimestamp
      ? `Active ${dayjs(chatRoom.data.lastTimestamp).fromNow()}`
      : '';

  const isInMode = selectedMode?.data?.isSelectMode;
  const modeType = selectedMode?.data?.mode;

  return (
    <>
      <div
        className={clsx(
          'relative flex items-center justify-between px-4 py-3 border-b border-content2/40',
          'bg-content1/60 backdrop-blur-md shadow-[0_1px_6px_rgba(0,0,0,0.15)]',
          'transition-all duration-300',
          isInMode && 'opacity-50 pointer-events-none',
        )}
      >
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          <Avatar
            className="size-10"
            fallback={chatRoom.data?.name?.charAt(0)}
            radius="full"
            size="md"
            src={getUrlMedia(chatRoom.data?.avatarUrl!)}
          />

          <div className="flex flex-col leading-tight text-left">
            <span className="font-semibold text-[15px] text-foreground">
              {chatRoom.data?.name}
            </span>
            <span
              className={clsx('text-xs transition-colors', {
                'text-success': chatRoom.data?.isOnline,
                'text-default-500': !chatRoom.data?.isOnline,
              })}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content="Voice call" placement="bottom">
            <Button
              isIconOnly
              className="hover:bg-primary/10 text-foreground/80"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl" icon="ph:phone-fill" />
            </Button>
          </Tooltip>

          <Tooltip content="Video call" placement="bottom">
            <Button
              isIconOnly
              className="hover:bg-primary/10 text-foreground/80"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl" icon="ph:video-camera-fill" />
            </Button>
          </Tooltip>

          <Tooltip content="More options" placement="bottom">
            <Button
              isIconOnly
              className="hover:bg-primary/10 text-foreground/80"
              size="sm"
              variant="light"
              onPress={() => moreOptionModal.handleShow()}
            >
              <Icon className="text-xl" icon="mdi:dots-horizontal" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <AnimatePresence>
        {isInMode && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'absolute top-0 left-0 right-0 text-center py-1 text-sm font-medium z-50',
              modeType === 'delete'
                ? 'bg-danger/20 text-danger border-b border-danger/30'
                : 'bg-primary/15 text-primary border-b border-primary/30',
            )}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
          >
            {modeType === 'delete'
              ? "You're deleting messages"
              : "You're forwarding messages"}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={moreOptionModal.isOpen}
        onOpenChange={moreOptionModal.onChangeOpen}
      >
        <ModalContent className="bg-background text-foreground border border-default-200">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold">
                Chat Info
              </ModalHeader>

              <ModalBody className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                <ChatInfoModal />
              </ModalBody>

              <Divider className="bg-default-100" />

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
