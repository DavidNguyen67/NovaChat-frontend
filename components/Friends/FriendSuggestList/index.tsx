/* eslint-disable prettier/prettier */
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ContextProp,
  GridComponents,
  GridListProps,
  VirtuosoGrid,
  VirtuosoGridHandle,
} from 'react-virtuoso';
import { useRouter } from 'next/navigation';

import { useFriends } from '../hook';
import { mockFriendRequests } from '../FriendRequestList/config';
import FriendItem, { FriendItemProps } from '../FriendItem';

import useBreakPoint from '@/hooks/useBreakpoint';
import { Friend } from '@/interfaces/response';
import FallBack from '@/components/FallBack';

interface ListGridProps extends GridListProps, ContextProp<any> {
  className?: string;
}

const ListGridComponents = forwardRef<HTMLDivElement, ListGridProps>(
  ({ children, style, className, ...props }, ref) => (
    <div ref={ref} {...props} className={className} style={style}>
      {children}
    </div>
  ),
);

ListGridComponents.displayName = 'ListGridComponents';

const gridComponents = (
  className: string,
): GridComponents<FriendItemProps> => ({
  List: (props) => (
    <ListGridComponents
      {...props}
      className={`${props.className} ${className}`}
    />
  ),
  Item: ({ children }) => children,
});

const FriendSuggestList = () => {
  const virtuoso = useRef<VirtuosoGridHandle>(null);

  const router = useRouter();

  const { isMobile, isTablet } = useBreakPoint();

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
    const gridCols = isMobile
      ? 'grid-cols-1'
      : isTablet
        ? 'grid-cols-3'
        : 'grid-cols-4';

    if (!dataView.length) {
      if (friendSuggestionsList.isMutating) {
        return (
          <div className={`grid ${gridCols} gap-4`}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <Card key={idx} className="space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300" />
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                  </Skeleton>
                </div>
              </Card>
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
          <FallBack
            message="You don't have any friend suggestions"
            type="empty"
          />
        );
      }
    }

    return (
      <VirtuosoGrid<Friend, FriendItemProps>
        ref={virtuoso}
        atTopStateChange={(atTop) => setIsScrollToTop(!atTop)}
        className="h-100 hide-scrollbar"
        components={gridComponents(`grid ${gridCols} gap-4 p-1`)}
        data={dataView}
        itemContent={(_, data) => <FriendItem data={data} />}
        totalCount={dataView.length}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-6xl mx-auto h-full min-h-[80vh]">
      <div className="flex flex-col h-full w-full gap-6">
        <Card
          className="border border-default-200/60 dark:border-default-100/20 bg-content1/70 backdrop-blur-md h-full flex flex-col"
          shadow="sm"
        >
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                {friendSuggestionsList.isMutating ? (
                  <Skeleton className="w-60 rounded-lg">
                    <div className="h-7 w-full rounded-lg bg-default-200" />
                  </Skeleton>
                ) : (
                  <>
                    <Icon
                      className="text-primary text-3xl"
                      icon="mdi:account-group-outline"
                    />
                    People you may know
                  </>
                )}
              </h2>

              {friendSuggestionsList.isMutating ? (
                <Skeleton className="w-12 rounded-lg">
                  <div className="h-8 w-full rounded-lg bg-default-200" />
                </Skeleton>
              ) : (
                <Button
                  className="text-primary"
                  radius="lg"
                  size="sm"
                  variant="light"
                  onPress={() => router.push('/friends/suggestions')}
                >
                  See all
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 h-full w-full relative text-gray-800 dark:text-gray-100">
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default FriendSuggestList;
