/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import React from 'react';
import { Avatar, Button, Card } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { Friend } from '@/interfaces/response';
import { formatNumber } from '@/helpers';

export interface FriendItemProps {
  data: Friend;
  isRequest?: boolean;
  onConfirm?: () => void;
}

const FriendItem = ({ data, isRequest, onConfirm }: FriendItemProps) => {
  const router = useRouter();

  return (
    <Card
      className="group p-5 rounded-2xl border border-default-200/20 bg-gradient-to-b from-content1/70 to-content1/40 backdrop-blur-xl shadow-sm hover:shadow-lg hover:border-default-200/40 transition-all duration-300"
      radius="lg"
      shadow="none"
    >
      <div
        className="flex flex-col items-start gap-3 cursor-pointer select-none"
        onClick={() => router.push(`/profile/${data.id}`)}
      >
        <div className="relative w-full">
          <Avatar
            alt={data?.fullName}
            className="w-full h-24 shadow-md ring-1 ring-default-100/40 group-hover:scale-105 transition-transform duration-300 object-contain"
            radius="lg"
            src={data?.avatarUrl}
          />
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-col text-start gap-1 w-full">
          <p className="font-semibold text-base text-foreground truncate max-w-[150px]">
            {data?.fullName}
          </p>
          <p className="font-medium text-xs text-default-500 h-[calc((1/0.75)*0.75rem)] line-clamp-1">
            {data?.followers && `${formatNumber(data?.followers)} Followers`}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Button
          fullWidth
          className="font-medium text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
          color="primary"
          radius="lg"
          size="sm"
          variant={isRequest ? 'solid' : 'flat'}
          onPress={() => onConfirm?.()}
        >
          {isRequest ? 'Confirm' : 'Add Friend'}
        </Button>
        <Button
          fullWidth
          className="font-medium text-sm text-default-500 hover:text-foreground transition-colors"
          color="default"
          radius="lg"
          size="sm"
          variant="flat"
        >
          {isRequest ? 'Delete' : 'Remove'}
        </Button>
      </div>
    </Card>
  );
};

export default FriendItem;
