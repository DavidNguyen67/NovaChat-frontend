/* eslint-disable prettier/prettier */
'use client';

import React, { useState } from 'react';
import { Avatar, Button, Card, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import Profile from '../Profile';

interface FriendSuggestion {
  id: string;
  name: string;
  avatarUrl: string;
  mutualFriends?: number;
  followers?: number;
  bio?: string;
}

const mockSuggestions: FriendSuggestion[] = [
  {
    id: '1',
    name: 'Quỳnh Trâm',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    mutualFriends: 1,
    bio: 'Loves photography & travel.',
  },
  {
    id: '2',
    name: 'Huyen Le',
    avatarUrl: 'https://i.pravatar.cc/150?img=49',
    followers: 203,
    bio: 'Designer at Freelance Studio.',
  },
  {
    id: '3',
    name: 'Bảo Ngọc',
    avatarUrl: 'https://i.pravatar.cc/150?img=36',
    bio: 'Coffee addict ☕ and bookworm 📚',
  },
  {
    id: '4',
    name: 'Thiên Trang',
    avatarUrl: 'https://i.pravatar.cc/150?img=58',
    mutualFriends: 2,
    bio: 'Student at UIT - HCM.',
  },
  {
    id: '5',
    name: 'Thu Phương',
    avatarUrl: 'https://i.pravatar.cc/150?img=59',
    followers: 334,
    bio: 'Marketing lover 💼',
  },
];

const FriendSuggestions = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<FriendSuggestion | null>(null);

  return (
    <div
      className={clsx(
        'flex h-[calc(100vh-6rem)] w-full overflow-hidden rounded-2xl shadow-lg border border-default-200/30 transition-all',
        'bg-gradient-to-br from-white/40 via-white/70 to-blue-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-black',
      )}
    >
      {/* LEFT: Suggestions list */}
      <div className="w-[300px] flex flex-col border-r border-default-100/30 backdrop-blur-md bg-white/60 dark:bg-gray-900/50 p-4 overflow-y-auto h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => router.back()}
          >
            <Icon className="text-lg text-foreground" icon="mdi:arrow-left" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Friends</h2>
        </div>

        <Divider className="my-2" />
        <h3 className="text-md font-bold text-foreground mb-3">Suggestions</h3>

        <p className="text-sm font-medium text-default-500 mb-4">
          People you may know
        </p>

        <div className="flex flex-col gap-3 flex-1">
          {mockSuggestions.map((person) => (
            <Card
              key={person.id}
              isPressable
              className={clsx(
                'transition-all border border-transparent hover:border-primary/40 hover:bg-primary/5',
                selected?.id === person.id && 'border-primary/60 bg-primary/10',
              )}
              radius="lg"
              shadow="none"
              onPress={() => setSelected(person)}
            >
              <div className="flex items-start gap-3 p-3">
                <Avatar
                  alt={person.name}
                  className="size-12"
                  radius="full"
                  src={person.avatarUrl}
                />
                <div className="flex flex-col flex-1 text-start items-start">
                  <p className="font-medium text-sm text-foreground leading-tight line-clamp-1">
                    {person.name}
                  </p>
                  {person.mutualFriends && (
                    <p className="text-xs text-default-500">
                      {person.mutualFriends} mutual friend
                      {person.mutualFriends > 1 ? 's' : ''}
                    </p>
                  )}
                  {person.followers && (
                    <p className="text-xs text-default-500">
                      Followed by {person.followers}
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
          ))}
        </div>
      </div>

      {/* RIGHT: Preview area */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6 backdrop-blur-sm bg-white/20 dark:bg-gray-950/40 transition-all">
        {!selected ? (
          <>
            <Icon
              className="text-[6rem] text-default-400/60 mb-4"
              icon="mdi:account-group-outline"
            />
            <p className="text-base font-semibold text-default-500">
              Select asd names to preview their profile.
            </p>
          </>
        ) : (
          <Profile />
        )}
      </div>
    </div>
  );
};

export default FriendSuggestions;
