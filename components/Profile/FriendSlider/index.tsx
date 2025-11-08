/* eslint-disable prettier/prettier */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Carousel } from 'react-responsive-carousel';
import './style.scss';

import { useFriendSlider } from './hook';
import { fakeFriends } from './config';

import { Friend } from '@/interfaces/response';
import FallBack from '@/components/FallBack';
import FriendItem from '@/components/Friends/FriendItem';

const FriendSlider = () => {
  const { friendsList } = useFriendSlider();

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

      // const data = await friendsList.trigger({
      //   fetchCount: fetchCount.current,
      //   ...(lastId.current && {
      //     lastId: lastId.current,
      //   }),
      // });
      const data = fakeFriends(fetchCount.current);

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
    } catch (error) {
      console.log('Error: ', error);
    }
    querying.current = false;
  };

  const carouselRef = useRef<Carousel>(null);

  const refreshData = () => {
    lastId.current = null;
    hasMore.current = true;
    saveLists.current = [];
    setDataView([]);
    requestData();
    carouselRef.current?.moveTo(1);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleChange = (index: number) => {
    const threshold = dataView.length - 4;

    if (index >= threshold && hasMore.current && !querying.current) {
      requestData();
    }
  };

  const renderContent = () => {
    if (!dataView.length) {
      if (friendsList.isMutating) {
        return (
          <div className="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
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
        if (friendsList.error)
          return (
            <FallBack
              error={friendsList.error}
              type="error"
              onRetry={refreshData}
            />
          );

        return <FallBack message="You don't have any friends" type="empty" />;
      }
    }

    return (
      <>
        <Carousel
          ref={carouselRef}
          centerMode
          centerSlidePercentage={25}
          className="h-fit friend-slider-carousel"
          dynamicHeight={false}
          renderThumbs={() => []}
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          onChange={handleChange}
        >
          {dataView.map((item) => (
            <div key={item.id} className="px-3">
              <FriendItem data={item} />
            </div>
          ))}
        </Carousel>

        <Button
          isIconOnly
          aria-label="Previous"
          className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-4 shadow-lg backdrop-blur-md bg-content1/80 dark:bg-content2/60 hover:bg-primary/10 z-10"
          radius="full"
          variant="light"
          onPress={() => carouselRef.current?.onClickPrev()}
        >
          <Icon className="text-xl" icon="mdi:chevron-left" />
        </Button>

        <Button
          isIconOnly
          aria-label="Next"
          className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 shadow-lg backdrop-blur-md bg-content1/80 dark:bg-content2/60 hover:bg-primary/10 z-10"
          radius="full"
          variant="light"
          onPress={() => carouselRef.current?.onClickNext()}
        >
          <Icon className="text-xl" icon="mdi:chevron-right" />
        </Button>
      </>
    );
  };

  return (
    <Card
      className="w-full mx-auto border border-default-200/60 dark:border-default-100/20 bg-content1/70 backdrop-blur-md"
      shadow="sm"
    >
      <CardBody className="overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">
              {friendsList.isMutating ? (
                <Skeleton className="w-full rounded-lg">
                  <div className="h-3 w-full rounded-lg bg-default-200" />
                </Skeleton>
              ) : (
                'People you may know'
              )}
            </h3>
            <Button
              className="text-sm font-medium text-primary"
              radius="lg"
              size="sm"
              variant="light"
            >
              See all
            </Button>
          </div>

          <div className="relative w-full h-full">{renderContent()}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FriendSlider;
