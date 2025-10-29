/* eslint-disable prettier/prettier */
'use client';

import type { NotificationItem as Notification } from '@/interfaces/response';

import { Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useNotification } from './hook';
import NotificationItem from './NotificationItem';

import FallBack from '@/components/FallBack';

const NotificationDropdown = () => {
  const { notificationList } = useNotification();

  const [dataView, setDataView] = useState<Notification[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isShowScrollToTop, setIsScrollToTop] = useState<boolean>(false);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const hasMore = useRef<boolean>(true);

  const querying = useRef<boolean>(false);

  const fetchCount = useRef<number>(20);

  const lastTime = useRef<Date | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) return;

      querying.current = true;
      const data = await notificationList.trigger({});

      setDataView((prev) => [...data, ...prev]);

      if (data) {
        if (data.length >= fetchCount.current) {
          hasMore.current = true;
          lastTime.current = data[data.length - 1].createdAt;
        } else {
          lastTime.current = null;
          hasMore.current = false;
        }
      }
    } catch (error) {}
    querying.current = false;
  };

  const handleScrollToTop = () => {
    virtuoso.current?.scrollToIndex({
      index: 0,
      align: 'start',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    requestData();
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

  const renderContent = () => {
    if (!dataView.length) {
      if (notificationList.error) return <FallBack type="error" />;
      if (!notificationList.isMutating)
        return (
          <FallBack message="You don't have any notifications" type="empty" />
        );
    }

    return (
      <Virtuoso
        ref={virtuoso}
        atTopStateChange={(atTop) => setIsScrollToTop(!atTop)}
        components={{
          Footer: () =>
            dataView.length &&
            notificationList.isMutating && (
              <div className="py-3 text-center text-gray-500 dark:text-gray-400">
                <Spinner color="primary" size="sm" />
              </div>
            ),
        }}
        data={dataView}
        endReached={requestData}
        itemContent={(index, item) => (
          <NotificationItem data={item} index={index} />
        )}
        style={{ height: 400 }}
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
        <Icon className="text-2xl" icon="mdi:bell-outline" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[360px] bg-content1 border border-gray-200 dark:border-[#3A3B3C] rounded-lg shadow-xl overflow-hidden z-50 animate-fadeIn">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-[#3A3B3C]">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Notifications
            </h3>
            <button
              className="text-sm text-blue-500 hover:underline cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="h-full w-full py-4 pt-2 pl-2">{renderContent()}</div>
          {isShowScrollToTop && (
            <Button
              isIconOnly
              className="absolute bottom-[2.5rem] right-4 bg-green-500 hover:bg-green-600 text-white shadow-md rounded-full"
              size="sm"
              onPress={handleScrollToTop}
            >
              <Icon className="text-xl" icon="mdi:arrow-up" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
