import { Skeleton } from '@heroui/react';
import clsx from 'clsx';

const NotificationSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        'flex gap-3 p-3 rounded-lg items-start bg-default-50/40 dark:bg-default-100/20 border border-default-200/30',
        className,
      )}
    >
      {/* Icon placeholder */}
      <Skeleton className="rounded-full">
        <div className="size-8 rounded-full bg-default-300" />
      </Skeleton>

      {/* Text content placeholder */}
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="rounded-md">
          <div className="h-3 w-1/2 bg-default-300" />
        </Skeleton>
        <Skeleton className="rounded-md">
          <div className="h-3 w-4/5 bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-md">
          <div className="h-2 w-1/4 bg-default-200" />
        </Skeleton>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
