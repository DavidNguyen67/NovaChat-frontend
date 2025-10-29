/* eslint-disable prettier/prettier */

import { MESSAGE_STATUS, MESSAGE_TYPE } from '@/common';
import { Message } from '@/interfaces/response';

export const fakeMessages: Message[] = [
  {
    id: '1',
    roomId: 'room-1',
    senderId: 'alice',
    content: 'Hi! How can I help?',
    type: MESSAGE_TYPE.TEXT,
    createdAt: '2025-10-29T09:10:00Z',
    readBy: ['you'],
    status: MESSAGE_STATUS.DELIVERED,
  },
  {
    id: '2',
    roomId: 'room-1',
    senderId: 'you',
    content: 'I need a quick demo layout.',
    type: MESSAGE_TYPE.TEXT,
    createdAt: '2025-10-29T09:11:00Z',
    readBy: ['you', 'alice'],
    status: MESSAGE_STATUS.READ,
  },
  {
    id: '3',
    roomId: 'room-1',
    senderId: 'alice',
    content: 'Sure — here you go.',
    type: MESSAGE_TYPE.TEXT,
    createdAt: '2025-10-29T09:12:00Z',
    readBy: ['you'],
    status: MESSAGE_STATUS.DELIVERED,
  },
  {
    id: '4',
    roomId: 'room-1',
    senderId: 'you',
    content: 'Wow, that looks great. Thanks!',
    type: MESSAGE_TYPE.TEXT,
    createdAt: '2025-10-29T09:14:00Z',
    readBy: ['you', 'alice'],
    status: MESSAGE_STATUS.READ,
  },
  {
    id: '5',
    roomId: 'room-1',
    senderId: 'alice',
    content: 'No problem! 😊',
    type: MESSAGE_TYPE.TEXT,
    createdAt: '2025-10-29T09:15:00Z',
    readBy: ['you'],
    status: MESSAGE_STATUS.DELIVERED,
  },
];
