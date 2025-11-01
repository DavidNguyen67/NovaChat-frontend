/* eslint-disable prettier/prettier */
'use client';
import React from 'react';

import ChatRoomList from './ChatRoomList';
import ChatWindow from './ChatWindow';
import { ForwardMessageModal } from './ForwardMessageModal';
import DeleteMessageModal from './DeleteMessageModal';

const ChatBox = () => {
  return (
    <div className="flex w-full h-full border-2 rounded-2xl border-white/30 overflow-hidden backdrop-blur-md shadow-lg">
      <ChatRoomList />
      <ChatWindow />
      <ForwardMessageModal />
      <DeleteMessageModal />
    </div>
  );
};

export default ChatBox;
