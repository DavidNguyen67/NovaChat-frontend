/* eslint-disable prettier/prettier */
import { Skeleton } from '@heroui/react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const ChatRoomSkeleton = ({ className }: { className?: string }) => {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-gray-800/40 border border-white/10 backdrop-blur-md',
        className,
      )}
      initial={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      <Skeleton className="rounded-md">
        <div className="size-14 rounded-md bg-default-300" />
      </Skeleton>

      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="rounded-md">
          <div className="h-3 w-1/2 bg-default-300" />
        </Skeleton>

        <Skeleton className="rounded-md">
          <div className="h-3 w-3/4 bg-default-200" />
        </Skeleton>
      </div>
    </motion.div>
  );
};

export default ChatRoomSkeleton;
