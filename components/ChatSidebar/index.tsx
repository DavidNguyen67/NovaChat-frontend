/* eslint-disable prettier/prettier */
import React, { useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Tooltip,
  Input,
  Divider,
  ScrollShadow,
  Image,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { VirtuosoHandle } from 'react-virtuoso';

import { useChatRoom } from '../ChatBox/hook';

import { mockChatRoomList } from './config';

import { ChatRoom } from '@/interfaces/response';

const ChatSidebar = () => {
  const { chatRoom } = useChatRoom();

  const [showSidebar, setShowSidebar] = useState(true);

  const [dataView, setDataView] = useState<ChatRoom[]>([]);

  const [isShowScrollToTop, setIsShowScrollToTop] = useState<boolean>(false);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const hasMore = useRef<boolean>(true);

  const querying = useRef<boolean>(false);

  const fetchCount = useRef<number>(
    parseInt(process.env.NEXT_PUBLIC_FETCH_COUNT!) ?? 30,
  );

  const lastId = useRef<string | null>(null);

  const saveLists = useRef<ChatRoom[]>([]);

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

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="bg-gray-800/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <Avatar
            className="ring-2 ring-green-500"
            size="sm"
            src="https://i.pravatar.cc/150?img=10"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">4 Me Con</span>
            <span className="text-xs text-green-400">Active now</span>
          </div>
          <Icon className="text-gray-400" icon="mdi:chevron-down" />
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content="Call">
            <Button
              isIconOnly
              className="bg-transparent hover:bg-gray-700"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl text-blue-400" icon="mdi:phone" />
            </Button>
          </Tooltip>
          <Tooltip content="Video call">
            <Button
              isIconOnly
              className="bg-transparent hover:bg-gray-700"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl text-blue-400" icon="mdi:video" />
            </Button>
          </Tooltip>
          <Tooltip content="More">
            <Button
              isIconOnly
              className="bg-transparent hover:bg-gray-700"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl" icon="mdi:dots-horizontal" />
            </Button>
          </Tooltip>
          <Tooltip content="Close">
            <Button
              isIconOnly
              className="bg-transparent hover:bg-gray-700"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl" icon="mdi:close" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Messages Area with Background */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm" />

        {/* Messages */}
        <ScrollShadow className="absolute inset-0 p-4">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {/* Image Message */}
            <div className="flex justify-end">
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-300">11:54</span>
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-lg max-w-xs"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image
                    alt="food"
                    className="w-full h-auto"
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Reaction */}
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-lg">
                    <span className="text-lg">👍</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </ScrollShadow>
      </div>

      {/* Input Area */}
      <div className="bg-gray-800/80 backdrop-blur-md px-4 py-3 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            className="bg-transparent hover:bg-gray-700"
            size="sm"
            variant="light"
          >
            <Icon className="text-xl text-blue-400" icon="mdi:plus-circle" />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent hover:bg-gray-700"
            size="sm"
            variant="light"
          >
            <Icon className="text-xl text-blue-400" icon="mdi:image" />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent hover:bg-gray-700"
            size="sm"
            variant="light"
          >
            <Icon className="text-xl text-blue-400" icon="mdi:sticker-emoji" />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent hover:bg-gray-700"
            size="sm"
            variant="light"
          >
            <Icon className="text-xl text-blue-400" icon="mdi:gif" />
          </Button>

          <Input
            classNames={{
              inputWrapper: 'bg-gray-700/50 border-none',
              input: 'text-sm text-white placeholder:text-gray-400',
            }}
            placeholder="Aa"
            radius="full"
            size="sm"
          />

          <Button
            isIconOnly
            className="bg-transparent hover:bg-gray-700"
            size="sm"
            variant="light"
          >
            <Icon
              className="text-xl text-blue-400"
              icon="mdi:emoticon-happy-outline"
            />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent hover:bg-gray-700"
            size="sm"
            variant="light"
          >
            <Icon className="text-xl text-blue-400" icon="mdi:thumb-up" />
          </Button>
        </div>
      </div>

      {/* Right Sidebar - Members */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            className="absolute bottom-0 right-0 top-0 w-20 bg-gray-800/95 backdrop-blur-md border-l border-gray-700/50 flex flex-col items-center py-4 gap-3 z-20"
            exit={{ x: 100, opacity: 0 }}
            initial={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Toggle Button */}
            <Tooltip content="Hide sidebar" placement="left">
              <Button
                isIconOnly
                className="bg-gray-700 hover:bg-gray-600 mb-2"
                size="sm"
                onPress={() => setShowSidebar(false)}
              >
                <Icon icon="mdi:chevron-right" />
              </Button>
            </Tooltip>

            <Divider className="w-12 bg-gray-700" />

            {/* Members List */}
            <ScrollShadow className="flex flex-col items-center gap-3 flex-1">
              {dataView.map((member, index) => (
                <Tooltip key={member.id} content={member.name} placement="left">
                  <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative cursor-pointer"
                    initial={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      color={member.isOnline ? 'success' : 'default'}
                      content={member.unreadCount || ''}
                      isInvisible={!member.unreadCount}
                      placement="top-right"
                      shape="circle"
                      size="sm"
                    >
                      <Avatar
                        className={`ring-2 ${
                          member.isOnline ? 'ring-green-500' : 'ring-gray-600'
                        }`}
                        size="md"
                        src={member.avatarUrl}
                      />
                    </Badge>
                  </motion.div>
                </Tooltip>
              ))}
            </ScrollShadow>

            <Divider className="w-12 bg-gray-700" />

            {/* Action Buttons */}
            <Tooltip content="More options" placement="left">
              <Button
                isIconOnly
                className="bg-gray-700 hover:bg-gray-600"
                size="sm"
              >
                <Icon icon="mdi:dots-horizontal" />
              </Button>
            </Tooltip>

            <Tooltip content="New message" placement="left">
              <Button
                isIconOnly
                className="bg-blue-600 hover:bg-blue-500"
                size="sm"
              >
                <Icon icon="mdi:pencil" />
              </Button>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Sidebar Button (when hidden) */}
      {!showSidebar && (
        <motion.div
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-4 right-4 z-20"
          initial={{ x: 20, opacity: 0 }}
        >
          <Tooltip content="Show sidebar" placement="left">
            <Button
              isIconOnly
              className="bg-blue-600 hover:bg-blue-500 shadow-lg"
              size="lg"
              onPress={() => setShowSidebar(true)}
            >
              <Icon className="text-xl" icon="mdi:chevron-left" />
            </Button>
          </Tooltip>
        </motion.div>
      )}

      {/* Time Display */}
      <div className="absolute bottom-4 right-24 text-xs text-gray-400 font-medium">
        3:13 PM
      </div>
    </div>
  );
};

export default ChatSidebar;
