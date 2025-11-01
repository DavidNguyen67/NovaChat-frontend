/* eslint-disable prettier/prettier */
import useSWR from 'swr';

import { SelectedModeData } from './config';

import {
  GLOBAL_CHAT_ROOM_KEY,
  GLOBAL_SELECTED_MODE_CHAT,
} from '@/common/global';
import { ChatRoom, Message } from '@/interfaces/response';
import { useMutation } from '@/hooks/swr';
import { METHOD } from '@/common';

export const useChatRoom = () => {
  const chatRoom = useSWR<ChatRoom>(GLOBAL_CHAT_ROOM_KEY);

  const selectedMode = useSWR<SelectedModeData>(GLOBAL_SELECTED_MODE_CHAT);

  const openSelectModal = (mode: 'delete' | 'forward' | 'unknown') => {
    selectedMode.mutate({
      isOpenModal: true,
      selectedMessages: selectedMode.data?.selectedMessages || [],
      mode,
      isSelectMode: true,
    });
  };

  const clearSelectModal = () => {
    selectedMode.mutate({
      isOpenModal: false,
      selectedMessages: [],
      isSelectMode: false,
      mode: 'unknown',
    });
  };

  const toggleSelectMode = (
    mode: 'delete' | 'forward' | 'unknown',
    message?: Message,
  ) => {
    selectedMode.mutate({
      isSelectMode: !selectedMode.data?.isSelectMode,
      selectedMessages: message ? [message] : [],
      mode,
    });
  };

  const handleSelectMessage = (message: Message) => {
    const isSelected = selectedMode.data?.selectedMessages.some(
      (msg) => msg.id === message.id,
    );

    let updatedSelectedMessages: Message[] = [];

    if (isSelected) {
      updatedSelectedMessages = selectedMode.data?.selectedMessages.filter(
        (msg) => msg.id !== message.id,
      ) as Message[];
    } else {
      updatedSelectedMessages = [
        ...(selectedMode.data?.selectedMessages || []),
        message,
      ];
    }

    if (updatedSelectedMessages?.length === 0) {
      selectedMode.mutate({
        isSelectMode: false,
        selectedMessages: [],
      });

      return;
    }

    selectedMode.mutate({
      isSelectMode: true,
      mode: selectedMode?.data?.mode,
      selectedMessages: updatedSelectedMessages,
    });
  };

  const handleResetSelectMode = () => {
    selectedMode.mutate({
      isSelectMode: false,
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
    deleteMessages,
    toggleSelectMode,
    handleSelectMessage,
    handleResetSelectMode,
    selectedMode,
    openSelectModal,
    clearSelectModal,
  };
};
