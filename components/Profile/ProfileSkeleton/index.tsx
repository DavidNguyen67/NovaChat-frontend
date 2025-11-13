/* eslint-disable prettier/prettier */
import { Skeleton } from '@heroui/react';

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col w-full overflow-y-auto flex-1 rounded-2xl h-full">
      <div className="relative w-full">
        <div className="relative w-full h-[300px] md:h-[320px]">
          <Skeleton className="w-full h-full rounded-b-2xl">
            <div className="w-full h-full bg-default-300" />
          </Skeleton>

          <div className="absolute top-[calc(100%-2rem)] left-0 right-0 flex flex-col gap-4 px-6 md:px-24 z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
              {/* Avatar & Name Skeleton */}
              <div className="flex items-end gap-4">
                <Skeleton className="rounded-lg">
                  <div className="size-30 rounded-lg bg-default-300" />
                </Skeleton>

                <div className="hidden md:flex flex-col gap-2 pb-4">
                  <Skeleton className="rounded-md">
                    <div className="h-8 w-48 bg-default-300" />
                  </Skeleton>
                  <Skeleton className="rounded-md">
                    <div className="h-4 w-32 bg-default-200" />
                  </Skeleton>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-2 items-center mb-[0.5rem]">
                <Skeleton className="rounded-lg">
                  <div className="h-10 w-32 bg-default-300" />
                </Skeleton>
                <Skeleton className="rounded-lg">
                  <div className="h-10 w-32 bg-default-300" />
                </Skeleton>
                <Skeleton className="rounded-lg">
                  <div className="h-10 w-10 bg-default-300" />
                </Skeleton>
              </div>
            </div>

            {/* Mobile Name Skeleton */}
            <div className="flex md:hidden flex-col items-center text-center mt-2 gap-2">
              <Skeleton className="rounded-md">
                <div className="h-7 w-40 bg-default-300" />
              </Skeleton>
              <Skeleton className="rounded-md">
                <div className="h-4 w-24 bg-default-200" />
              </Skeleton>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="pt-26 px-6 md:px-24 z-20 flex-1 flex gap-4 flex-col h-full pb-6">
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 7 }).map((_, idx) => (
              <Skeleton key={idx} className="rounded-lg">
                <div className="h-10 w-24 bg-default-200" />
              </Skeleton>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="rounded-xl">
                <div className="h-32 bg-default-100" />
              </Skeleton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
