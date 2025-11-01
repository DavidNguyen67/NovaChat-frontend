/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  ModalContent,
  Input,
  Divider,
  Spinner,
  Avatar,
} from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useChatRoom } from '../hook';
import { mockChatRoomList } from '../ChatRoomList/config';

import { ChatRoom } from '@/interfaces/response';
import { useDebounceCallBack } from '@/hooks/useDebounceCallBack';
import FallBack from '@/components/FallBack';
import { getUrlMedia } from '@/helpers';

export const ForwardMessageModal: React.FC = () => {
  const { chatRoom, forwardModal, chatRoomList } = useChatRoom();

  const [searchValue, setSearchValue] = useState('');

  const [dataView, setDataView] = useState<ChatRoom[]>([]);

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const searchKey = useRef('');

  const hasMore = useRef(true);

  const querying = useRef(false);

  const fetchCount = useRef(20);

  const lastId = useRef<string | null>(null);

  const saveLists = useRef<ChatRoom[]>([]);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const [isShowScrollToTop, setIsShowScrollToTop] = useState(false);

  const debounceSearch = useDebounceCallBack(() => refreshData(), 300);

  const onClose = () => {
    forwardModal.mutate({ isOpen: false, message: undefined });
  };

  const onOpenChange = (isOpen: boolean) =>
    forwardModal.mutate({ isOpen, message: forwardModal.data?.message });

  const handleScrollToTop = () => {
    virtuoso.current?.scrollToIndex({
      index: 0,
      align: 'start',
      behavior: 'smooth',
    });
  };

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) return;

      querying.current = true;
      // const data = await chatRoomList.trigger({ ... });
      const data = mockChatRoomList;

      if (data) {
        const newData = [...saveLists.current, ...data];

        setDataView(newData);
        saveLists.current = newData;

        if (data.length >= fetchCount.current) {
          hasMore.current = true;
          lastId.current = data[data.length - 1].id;
        } else {
          lastId.current = null;
          hasMore.current = false;
        }
      }
    } finally {
      querying.current = false;
    }
  };

  const refreshData = () => {
    lastId.current = null;
    hasMore.current = true;
    saveLists.current = [];
    setDataView([]);
    requestData();
  };

  useEffect(() => {
    debounceSearch();
  }, [chatRoom?.data?.id, searchValue]);

  const toggleSelectRoom = (id: string) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleSubmitForward = () => {
    console.log('Forward message:', forwardModal.data?.message);
    console.log('To rooms:', selectedRooms);
    setSelectedRooms([]);
    onClose();
  };

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
        className="overflow-x-hidden"
        components={{
          Footer: () =>
            Boolean(dataView.length) &&
            chatRoomList.isMutating && (
              <div className="py-3 text-center text-gray-500 dark:text-gray-400">
                <Spinner color="primary" size="sm" />
              </div>
            ),
        }}
        data={dataView}
        endReached={requestData}
        itemContent={(index, item) => {
          const isSelected = selectedRooms.includes(item.id);

          return (
            <motion.button
              key={item.id}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all mb-1 mr-2 relative',
                'hover:bg-primary/10 active:bg-primary/20',
                isSelected && 'bg-primary/15 ring-1 ring-primary/30',
              )}
              transition={{ duration: 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleSelectRoom(item.id)}
            >
              <div className="size-10">
                <Avatar
                  className={clsx('transition-all ring-2 size-10')}
                  fallback={item?.name?.charAt(0)?.toUpperCase()}
                  radius="md"
                  size="md"
                  src={getUrlMedia(item?.avatarUrl!)}
                />
              </div>
              <div className="flex flex-col truncate flex-1">
                <span className="font-medium text-foreground truncate">
                  {item.name}
                </span>
                {item.lastMessage && (
                  <span className="text-xs text-default-500 truncate">
                    {item.lastMessage.content}
                  </span>
                )}
              </div>

              {isSelected && (
                <Icon
                  className="text-primary text-xl absolute right-3"
                  icon="mdi:check-circle"
                />
              )}
            </motion.button>
          );
        }}
      />
    );
  };

  return (
    <Modal isOpen={forwardModal?.data?.isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="bg-[#1e1f22] text-white">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg font-semibold">
              📤 Forward Message
            </ModalHeader>

            <ModalBody className="flex flex-col gap-4">
              <Input
                aria-label="Search chat"
                classNames={{
                  inputWrapper: clsx(
                    'bg-white/10 dark:bg-white/10',
                    'border border-white/20 focus-within:border-primary/60',
                    'rounded-lg backdrop-blur-md transition-all duration-200',
                    'hover:bg-white/20 hover:border-primary/40',
                  ),
                  input: 'text-sm text-white placeholder:text-gray-400',
                }}
                placeholder="Search chat..."
                startContent={
                  <Icon
                    className="text-lg text-gray-400 group-focus-within:text-primary transition-colors"
                    icon="mdi:magnify"
                  />
                }
                value={searchValue}
                onBlur={() => searchValue && debounceSearch()}
                onChange={(e) => {
                  searchKey.current = e.target.value;
                  setSearchValue(e.target.value);
                  debounceSearch();
                }}
              />

              <Divider className="my-2" />

              <div className="relative h-[400px] w-full">
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 h-full w-full relative text-gray-800 dark:text-gray-100">
                  {renderContent()}
                </div>

                <AnimatePresence>
                  {isShowScrollToTop && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-[2.5rem] right-4"
                      exit={{ opacity: 0, y: 10 }}
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        isIconOnly
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-transform"
                        size="sm"
                        onPress={handleScrollToTop}
                      >
                        <Icon className="text-xl" icon="mdi:arrow-up" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ModalBody>

            <ModalFooter className="flex items-center justify-between">
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                color="primary"
                isDisabled={!selectedRooms.length}
                onPress={handleSubmitForward}
              >
                <Icon className="mr-1 text-lg" icon="mdi:send" />
                Forward ({selectedRooms.length})
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
