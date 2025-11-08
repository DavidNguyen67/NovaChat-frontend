/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prettier/prettier */
'use client';

import type { ChatRoom } from '@/interfaces/response';

import { Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import FallBack from '@/components/FallBack';
import { useChatRoom } from '@/components/ChatBox/hook';
import ChatRoomItem from '@/components/ChatBox/ChatRoomList/ChatRoomItem';
import ChatRoomSkeleton from '@/components/ChatBox/ChatRoomList/ChatRoomSkeletonItem';
import { mockChatRoomList } from '@/components/ChatBox/ChatRoomList/config';

const ChatRoomDropdown = () => {
  const { chatRoomList } = useChatRoom();

  const [dataView, setDataView] = useState<ChatRoom[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isShowScrollToTop, setIsScrollToTop] = useState<boolean>(false);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const hasMore = useRef<boolean>(true);

  const querying = useRef<boolean>(false);

  const fetchCount = useRef<number>(
    parseInt(process.env.NEXT_PUBLIC_FETCH_COUNT!) ?? 30,
  );

  const saveLists = useRef<ChatRoom[]>([]);

  const lastId = useRef<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) return;

      querying.current = true;
      // const data = await chatRoomList.trigger({
      //   fetchCount: fetchCount.current,
      //   ...(lastId.current ? { lastId: lastId.current } : {}),
      // });
      const data = mockChatRoomList(fetchCount.current);

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

  const handleScrollToTop = () => {
    virtuoso.current?.scrollToIndex({
      index: 0,
      align: 'start',
      behavior: 'smooth',
    });
  };

  const refreshData = () => {
    lastId.current = null;
    hasMore.current = true;
    saveLists.current = [];
    setDataView([]);
    requestData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const router = useRouter();

  const renderContent = () => {
    if (!dataView.length) {
      if (chatRoomList.isMutating)
        return (
          <div className="flex flex-col gap-2 pr-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ChatRoomSkeleton key={idx} />
            ))}
          </div>
        );
      else {
        if (chatRoomList.error)
          return (
            <FallBack
              error={chatRoomList.error}
              type="error"
              onRetry={refreshData}
            />
          );

        return (
          <FallBack message="You don't have any chat rooms" type="empty" />
        );
      }
    }

    return (
      <Virtuoso
        ref={virtuoso}
        atTopStateChange={(atTop) => setIsScrollToTop(!atTop)}
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
        itemContent={(index, item) => (
          <ChatRoomItem className="!ml-0 !mr-2" data={item} index={index} />
        )}
      />
    );
  };

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        isIconOnly
        className="bg-gray-200 dark:bg-[#3A3B3C] hover:bg-gray-300 dark:hover:bg-[#4E4F50] rounded-full transition"
        size="sm"
        onPress={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Icon className="text-2xl" icon="mdi:message-outline" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[360px] bg-content1 border border-gray-200 dark:border-[#3A3B3C] rounded-lg shadow-xl overflow-hidden z-50 animate-fadeIn">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-[#3A3B3C]">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Messages
            </h3>
            <button
              className="text-sm text-blue-500 hover:underline cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="relative h-[400px] w-full py-2 pl-2">
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 h-full w-full relative text-gray-800 dark:text-gray-100">
              {renderContent()}
              <AnimatePresence>
                {isShowScrollToTop && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-8 right-4"
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
              <div
                className="text-center text-gray-500 dark:text-gray-400 text-sm leading-normal cursor-pointer hover:underline mt-auto mx-auto"
                onClick={() => {
                  router.push('/chat-room');
                }}
              >
                View all
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomDropdown;
