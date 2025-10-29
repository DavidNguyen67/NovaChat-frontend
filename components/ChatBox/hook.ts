/* eslint-disable prettier/prettier */
import useSWR from 'swr';

import { GLOBAL_CHAT_ROOM_KEY } from '@/common/global';
import { ChatRoom, Message } from '@/interfaces/response';
import { useMutation } from '@/hooks/swr';

export const useChatRoom = () => {
  const chatRoom = useSWR<ChatRoom>(GLOBAL_CHAT_ROOM_KEY);

  const chatRoomList = useMutation<ChatRoom[]>('chat-room', {
    url: 'chat-room',
  });

  const messageList = useMutation<Message[]>('message' + chatRoom.data?.id, {
    url: 'message',
  });

  return {
    chatRoom,
    chatRoomList,
    messageList,
  };
};
