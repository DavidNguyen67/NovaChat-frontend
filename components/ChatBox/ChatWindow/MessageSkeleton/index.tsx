/* eslint-disable prettier/prettier */
import { Skeleton } from '@heroui/react';
import clsx from 'clsx';

interface MessageSkeletonProps {
  isSelf?: boolean;
}

const MessageSkeleton = ({ isSelf = false }: MessageSkeletonProps) => {
  return (
    <div
      className={clsx(
        'flex w-full px-4 my-2 animate-in fade-in duration-300',
        isSelf ? 'justify-end' : 'justify-start',
      )}
    >
      {!isSelf && (
        <div className="flex items-end gap-3 max-w-[80%]">
          <Skeleton className="rounded-full">
            <div className="size-8 rounded-full bg-default-300" />
          </Skeleton>
          <div className="flex flex-col gap-2">
            <Skeleton className="rounded-2xl">
              <div className="h-8 w-[200px] bg-default-200 rounded-2xl" />
            </Skeleton>
            <Skeleton className="rounded-2xl">
              <div className="h-8 w-[250px] bg-default-200 rounded-2xl" />
            </Skeleton>
          </div>
        </div>
      )}

      {isSelf && (
        <div className="flex gap-2 max-w-[70%] flex-row-reverse items-center">
          <div className="flex flex-col gap-2 items-end">
            <Skeleton className="rounded-2xl">
              <div className="h-8 w-[200px] bg-default-300 rounded-2xl" />
            </Skeleton>
            <Skeleton className="rounded-2xl">
              <div className="h-8 w-[150px] bg-default-300 rounded-2xl" />
            </Skeleton>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSkeleton;
