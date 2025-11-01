/* eslint-disable prettier/prettier */
import useSWR from 'swr';

import { GLOBAL_CHAT_ROOM_KEY } from '@/common/global';
import { ChatRoom, Message } from '@/interfaces/response';
import { useMutation } from '@/hooks/swr';
import { METHOD } from '@/common';

export const useChatRoom = () => {
  const chatRoom = useSWR<ChatRoom>(GLOBAL_CHAT_ROOM_KEY);

  const chatRoomList = useMutation<ChatRoom[]>('/api/v1/chat-room', {
    url: '/api/v1/chat-room',
    method: METHOD.GET,
  });

  const messageList = useMutation<Message[]>(
    '/api/v1/message' + chatRoom.data?.id,
    {
      url: '/api/v1/message',
      method: METHOD.GET,
    },
  );

  const sendMessage = useMutation<Message>('/api/v1/message', {
    url: '/api/v1/message',
    method: METHOD.POST,
  });

  return {
    chatRoom,
    chatRoomList,
    messageList,
    sendMessage,
  };
};
