/* eslint-disable prettier/prettier */
'use client';
import React from 'react';

import ChatRoomList from './ChatRoomList';
import ChatWindow from './ChatWindow';
import { ForwardMessageModal } from './ForwardMessageModal';
import DeleteMessageModal from './DeleteMessageModal';

const ChatBox = () => {
  return (
    <div className="flex w-full h-full">
      <ChatRoomList />
      <ChatWindow />
      <ForwardMessageModal />
      <DeleteMessageModal />
    </div>
  );
};

export default ChatBox;
