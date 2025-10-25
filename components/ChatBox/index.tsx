/* eslint-disable prettier/prettier */
'use client';
import React from 'react';

import ChatRoomList from './ChatRoomList';

const ChatBox = () => {
  return (
    <div className="flex w-full h-full border-2 border-default-200 p-4 rounded-lg">
      <ChatRoomList />
    </div>
  );
};

export default ChatBox;
