/* eslint-disable prettier/prettier */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, Skeleton, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { AnimatePresence, motion } from 'framer-motion';

import FallBack from '../FallBack';
import { useFriends } from '../Friends/hook';
import Profile from '../Profile';
import { mockFriendRequests } from '../Friends/FriendRequestList/config';

import FriendSuggestionItem from './FriendSuggestionItem';

import { Friend } from '@/interfaces/response';

const FriendSuggestions = () => {
  const router = useRouter();

  const virtuoso = useRef<VirtuosoHandle>(null);

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const [isShowScrollToTop, setIsScrollToTop] = useState<boolean>(false);

  const { friendSuggestionsList } = useFriends();

  const fetchCount = useRef<number>(
    parseInt(process.env.NEXT_PUBLIC_FETCH_COUNT!) ?? 30,
  );

  const saveLists = useRef<Friend[]>([]);

  const lastId = useRef<string | null>(null);

  const [dataView, setDataView] = useState<Friend[]>([]);

  const hasMore = useRef(true);

  const querying = useRef(false);

  const requestData = async () => {
    try {
      if (!hasMore.current || querying.current) {
        return;
      }
      querying.current = true;

      // const data = await friendSuggestionsList.trigger({
      //   fetchCount: fetchCount.current,
      //   ...(lastId.current && {
      //     lastId: lastId.current,
      //   }),
      // });
      const data = mockFriendRequests(fetchCount.current);

      if (data) {
        setDataView([...saveLists.current, ...data]);
        saveLists.current = [...saveLists.current, ...data];

        if (data.length >= fetchCount.current) {
          hasMore.current = true;
          lastId.current = data[data.length - 1].id;
        } else {
          lastId.current = null;
          hasMore.current = false;
        }
      }
    } catch (error) {}
    querying.current = false;
  };

  const refreshData = () => {
    lastId.current = null;
    hasMore.current = true;
    saveLists.current = [];
    setDataView([]);
    requestData();
  };

  const handleScrollToTop = () => {
    virtuoso.current?.scrollToIndex({
      index: 0,
      align: 'start',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const renderContent = () => {
    if (!dataView.length) {
      if (friendSuggestionsList.isMutating) {
        return (
          <div className="space-y-2">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="pb-2">
                <Card className="overflow-hidden" radius="lg" shadow="none">
                  <div className="flex items-start gap-3 p-3 w-full">
                    {/* Avatar skeleton */}
                    <Skeleton className="rounded-full flex-shrink-0">
                      <div className="size-12 rounded-full bg-default-300" />
                    </Skeleton>

                    {/* Content skeleton */}
                    <div className="flex flex-col flex-1 gap-2">
                      {/* Name skeleton */}
                      <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-4 w-2/5 rounded-lg bg-default-300" />
                      </Skeleton>

                      {/* Mutual friends skeleton */}
                      <div className="flex items-center gap-1">
                        {/* Avatars stack skeleton */}
                        <div className="flex -space-x-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="rounded-full">
                              <div className="size-5 rounded-full bg-default-200 border-2 border-background" />
                            </Skeleton>
                          ))}
                        </div>
                        {/* Mutual text skeleton */}
                        <Skeleton className="w-24 rounded-lg ml-1">
                          <div className="h-3 w-24 rounded-lg bg-default-200" />
                        </Skeleton>
                      </div>

                      {/* Buttons skeleton */}
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="rounded-lg">
                          <div className="h-8 w-20 rounded-lg bg-default-300" />
                        </Skeleton>
                        <Skeleton className="rounded-lg">
                          <div className="h-8 w-16 rounded-lg bg-default-200" />
                        </Skeleton>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        );
      } else {
        if (friendSuggestionsList.error)
          return (
            <FallBack
              error={friendSuggestionsList.error}
              type="error"
              onRetry={refreshData}
            />
          );

        return (
          <FallBack message="You don't have any friend requests" type="empty" />
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
            friendSuggestionsList.isMutating && (
              <div className="py-3 text-center text-gray-500 dark:text-gray-400">
                <Spinner color="primary" size="sm" />
              </div>
            ),
        }}
        data={dataView}
        endReached={requestData}
        itemContent={(_, item) => (
          <FriendSuggestionItem
            data={item}
            selectedFriend={selectedFriend}
            onChangeSelected={setSelectedFriend}
          />
        )}
      />
    );
  };

  return (
    <div
      className={clsx(
        'flex h-[calc(100vh-6rem)] w-full overflow-hidden rounded-2xl shadow-lg border border-default-200/30 transition-all',
        'bg-gradient-to-br from-white/40 via-white/70 to-blue-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-black',
      )}
    >
      {/* LEFT: Suggestions list */}
      <div className="w-[360px] flex flex-col border-r border-default-100/30 backdrop-blur-md bg-white/60 dark:bg-gray-900/50 p-4 overflow-y-auto h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => router.back()}
          >
            <Icon className="text-lg text-foreground" icon="mdi:arrow-left" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Friends</h2>
        </div>

        <Divider className="my-2" />
        <h3 className="text-md font-bold text-foreground mb-3">Suggestions</h3>

        <p className="text-sm font-medium text-default-500 mb-4">
          People you may know
        </p>

        <div className="flex flex-col gap-3 flex-1 relative h-full">
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
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center px-6 backdrop-blur-sm bg-white/20 dark:bg-gray-950/40 transition-all">
        {!selectedFriend ? (
          <>
            <Icon
              className="text-[6rem] text-default-400/60 mb-4"
              icon="mdi:account-group-outline"
            />
            <p className="text-base font-semibold text-default-500">
              Select a friend to preview their profile.
            </p>
          </>
        ) : (
          <Profile userId={selectedFriend.id} />
        )}
      </div>
    </div>
  );
};

export default FriendSuggestions;
