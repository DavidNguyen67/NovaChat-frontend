/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prettier/prettier */
import React from 'react';
import clsx from 'clsx';
import { Avatar, Button, Card } from '@heroui/react';

import { Friend } from '@/interfaces/response';
import MutualFriendItem from '@/components/MutualFriendItem';
import { formatNumber } from '@/helpers';

interface FriendSuggestionItemProps {
  data: Friend;
  selectedFriend?: Friend | null;
  onChangeSelected: (friend: Friend) => void;
}

const FriendSuggestionItem = ({
  data,
  selectedFriend,
  onChangeSelected,
}: FriendSuggestionItemProps) => {
  return (
    <div className="pb-2">
      <div className="cursor-pointer" onClick={() => onChangeSelected(data)}>
        <Card
          className={clsx(
            'transition-all border border-transparent hover:border-primary/40 hover:bg-primary/5 overflow-hidden',
            selectedFriend?.id === data.id &&
              'border-primary/60 bg-primary/10 w-full',
          )}
          radius="lg"
          shadow="none"
        >
          <div className="flex items-start gap-3 p-3 w-full">
            <Avatar
              alt={data.fullName}
              className="size-12"
              radius="full"
              src={data.avatarUrl}
            />
            <div className="flex flex-col flex-1 text-start items-start gap-0.5">
              <p className="font-medium text-sm text-foreground leading-tight line-clamp-1">
                {data.fullName}
              </p>
              {data?.mutualFriends?.length! > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {data?.mutualFriends
                      ?.slice(0, 5)
                      ?.map((friend) => (
                        <MutualFriendItem key={friend.id} data={friend} />
                      ))}
                  </div>
                  <p className="text-xs text-default-500 ml-1 line-clamp-1">
                    {data?.mutualFriends?.length} mutual friend
                    {data?.mutualFriends?.length! > 1 ? 's' : ''}
                  </p>
                </div>
              )}
              {data.followers && (
                <p className="text-xs text-default-500">
                  Followed by {formatNumber(data.followers)}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <Button
                  className="font-medium text-xs shadow-sm"
                  color="primary"
                  radius="lg"
                  size="sm"
                >
                  Add friend
                </Button>
                <Button
                  className="font-medium text-xs"
                  color="default"
                  radius="lg"
                  size="sm"
                  variant="flat"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FriendSuggestionItem;
