/* eslint-disable prettier/prettier */
import React from 'react';
import { Avatar, Button, Divider, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

import { Friend } from '@/interfaces/response';
import { formatNumber } from '@/helpers';

interface MutualFriendItemProps {
  data: Friend;
}

const MutualFriendItem = ({ data }: MutualFriendItemProps) => {
  const mutualFriendsName = data?.mutualFriends
    ?.map?.((item) => item.fullName)
    ?.slice?.(0, 3);

  const tooltipContent = (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-3 w-[280px] p-2"
      initial={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex items-start gap-3">
        <Avatar
          alt={data.fullName}
          className="size-14 rounded-lg shadow-md ring-2 ring-primary/20"
          src={data.avatarUrl}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-base text-foreground truncate">
            {data.fullName}
          </span>
          {data.bio && (
            <span className="text-xs text-default-500 line-clamp-2 mt-0.5">
              {data.bio}
            </span>
          )}
          {data.followers && (
            <span className="text-xs text-default-400 mt-1">
              {formatNumber(data.followers)} followers
            </span>
          )}
        </div>
      </div>

      <Divider className="my-1" />

      <div className="flex items-start gap-2 px-1">
        {data.mutualFriends?.length! > 0 && (
          <Icon
            className="text-default-400 text-lg mt-0.5 flex-shrink-0"
            icon="mdi:account-multiple-outline"
          />
        )}
        <div className="flex flex-col gap-1">
          {data.mutualFriends?.length! > 0 && (
            <span className="text-xs text-default-600 font-medium">
              {data.mutualFriends?.length} mutual friends
            </span>
          )}
          {mutualFriendsName?.length! > 0 && (
            <span className="text-xs text-default-500">
              Including{' '}
              {mutualFriendsName?.map((item, index) => (
                <React.Fragment key={index}>
                  <strong>{item}</strong>
                  <>{index < mutualFriendsName.length - 1 && <>, </>}</>
                </React.Fragment>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button
          fullWidth
          className="font-medium shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
          color="primary"
          size="sm"
          startContent={<Icon icon="mdi:message-outline" />}
          variant="flat"
        >
          Send Message
        </Button>

        <Button
          fullWidth
          className="font-medium text-default-600 hover:text-danger hover:bg-danger/10 transition-colors"
          color="default"
          size="sm"
          startContent={<Icon icon="mdi:account-remove-outline" />}
          variant="flat"
        >
          Unfriend
        </Button>
      </div>
    </motion.div>
  );

  return (
    <Tooltip
      showArrow
      className="p-0 rounded-xl border border-default-200/50 shadow-xl backdrop-blur-md bg-content1/95"
      closeDelay={100}
      content={tooltipContent}
      offset={10}
      placement="bottom"
    >
      <motion.div
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Avatar
          alt={data.fullName}
          className="size-8 rounded-full border-2 border-background shadow-md cursor-pointer hover:border-primary/50 transition-all"
          src={data.avatarUrl}
        />
      </motion.div>
    </Tooltip>
  );
};

export default MutualFriendItem;
