/* eslint-disable prettier/prettier */
'use client';
import React from 'react';

import ChatRoomList from './ChatRoomList';
import ChatWindow from './ChatWindow';

const ChatBox = () => {
  return (
    <div className="flex w-full h-full border-2 border-default-200 rounded-lg">
      <ChatRoomList />
      <ChatWindow />
    </div>
  );
};

export default ChatBox;
