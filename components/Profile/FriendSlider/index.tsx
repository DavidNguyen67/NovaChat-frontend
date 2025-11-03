/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useKeenSlider } from 'keen-slider/react';
import { useRouter } from 'next/navigation';

import { useFriendSlider } from './hook';
import { fakeFriends } from './config';

import { Friend } from '@/interfaces/response';
import { getUrlMedia } from '@/helpers';

const FriendSlider = () => {
  const { listFriends } = useFriendSlider();
  const router = useRouter();

  const [dataView, setDataView] = useState<Friend[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const fetchCount = useRef(10);
  const page = useRef(0);
  const hasMore = useRef(true);
  const querying = useRef(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 5, spacing: 12 },
    breakpoints: {
      '(max-width: 1024px)': { slides: { perView: 3, spacing: 10 } },
      '(max-width: 640px)': { slides: { perView: 2, spacing: 8 } },
    },
    slideChanged(slider) {
      const newSlide = slider.track.details.rel;

      setCurrentSlide(newSlide);

      const total = slider?.track?.details?.slides?.length;
      const perView = 5;

      if (newSlide >= total - perView - 1) {
        requestData();
      }
    },
    created() {
      setLoaded(true);
    },
  });

  const requestData = useCallback(async () => {
    if (querying.current || !hasMore.current) return;

    querying.current = true;
    try {
      const start = page.current * fetchCount.current;
      const end = start + fetchCount.current;

      const data = fakeFriends.slice(start, end);

      if (data.length > 0) {
        setDataView((prev) => [...prev, ...data]);
        page.current += 1;
      } else {
        hasMore.current = false;
      }
    } finally {
      querying.current = false;
    }
  }, []);

  useEffect(() => {
    requestData();
  }, []);

  const gotoNextPage = () => {
    if (!instanceRef.current) return;
    const slider = instanceRef.current;
    const perView = 5;

    const maxStart = Math.max(
      0,
      slider?.track?.details?.slides?.length - perView,
    );
    const target = Math.min(currentSlide + perView, maxStart);

    (slider as any).moveToIdx?.(target);
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
              People you may know
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

          <div className="relative w-full">
            <div ref={sliderRef} className="keen-slider">
              {dataView.map((item) => (
                <div
                  key={item.id}
                  className="keen-slider__slide flex flex-col items-center gap-2 p-4 rounded-xl border border-default-200/60 bg-content1/40 hover:bg-default-100/60 dark:bg-content2/40 dark:hover:bg-default-50/30 cursor-pointer transition-all duration-200"
                  onClick={() => router.push(`/profile/${item.id}`)}
                >
                  <div className="size-16">
                    <Avatar
                      className="size-16 shadow-sm"
                      fallback={item.fullName?.charAt(0)}
                      radius="full"
                      src={getUrlMedia(item.avatarUrl!)}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground truncate max-w-[120px] text-center">
                    {item.fullName}
                  </span>
                  <Button
                    className="mt-1"
                    color="primary"
                    radius="lg"
                    size="sm"
                    variant="flat"
                  >
                    Add Friend
                  </Button>
                </div>
              ))}
            </div>

            {loaded && (
              <Button
                isIconOnly
                aria-label="Next"
                className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 shadow-lg backdrop-blur-md bg-content1/80 dark:bg-content2/60 hover:bg-primary/10 z-10"
                radius="full"
                variant="light"
                onPress={gotoNextPage}
              >
                <Icon className="text-xl" icon="mdi:chevron-right" />
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FriendSlider;
