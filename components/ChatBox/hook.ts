/* eslint-disable prettier/prettier */
import useSWR from 'swr';

import { DeleteModeData, ForwardModalData } from './config';

import {
  GLOBAL_CHAT_ROOM_KEY,
  CHAT_FORWARD_MODAL,
  CHAT_DELETE_MODE,
} from '@/common/global';
import { ChatRoom, Message } from '@/interfaces/response';
import { useMutation } from '@/hooks/swr';
import { METHOD } from '@/common';
import { useAccount } from '@/hooks/auth/useAccount';

export const useChatRoom = () => {
  const { accountInfo } = useAccount();

  const chatRoom = useSWR<ChatRoom>(GLOBAL_CHAT_ROOM_KEY);

  const forwardModal = useSWR<ForwardModalData>(CHAT_FORWARD_MODAL);

  const deleteMode = useSWR<DeleteModeData>(CHAT_DELETE_MODE);

  const handleSelectDeleteMessage = (message: Message) => {
    if (!deleteMode.data?.isDeleteMode) return;
    if (accountInfo.data?.id !== message.sender?.id) return;

    const isSelected = deleteMode.data.selectedMessages.some(
      (m) => m.id === message.id,
    );
    let updatedSelectedMessages: Message[] = [];

    if (isSelected) {
      updatedSelectedMessages = deleteMode.data.selectedMessages.filter(
        (m) => m.id !== message.id,
      );
    } else {
      updatedSelectedMessages = [...deleteMode.data.selectedMessages, message];
    }
    deleteMode.mutate({
      ...deleteMode.data,
      selectedMessages: updatedSelectedMessages,
    });
  };

  const handleResetDeleteMode = () => {
    deleteMode.mutate({
      ...deleteMode?.data,
      isDeleteMode: false,
      selectedMessages: [],
    });
  };

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

  const deleteMessages = useMutation<void>('/api/v1/message/delete', {
    url: '/api/v1/message/delete',
    method: METHOD.DELETE,
    notification: {
      title: 'Delete Messages',
      message: 'Delete messages successfully.',
    },
  });

  return {
    chatRoom,
    chatRoomList,
    messageList,
    sendMessage,
    forwardModal,
    deleteMode,
    handleSelectDeleteMessage,
    handleResetDeleteMode,
    deleteMessages,
  };
};
