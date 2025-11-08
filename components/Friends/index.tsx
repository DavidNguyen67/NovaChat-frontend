/* eslint-disable prettier/prettier */
'use client';

import React from 'react';
import { Divider } from '@heroui/react';

import FriendRequestList from './FriendRequestList';
import FriendSuggestList from './FriendSuggestList';

const Friends = () => {
  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-6xl mx-auto h-full overflow-y-scroll flex-1">
      <FriendRequestList />

      <Divider className="my-2" />

      <FriendSuggestList />
    </div>
  );
};

export default Friends;
