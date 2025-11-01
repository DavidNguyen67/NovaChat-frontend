/* eslint-disable prettier/prettier */

import {
  CHAT_ROOM_TYPE,
  GENDER,
  MESSAGE_STATUS,
  MESSAGE_TYPE,
  NOTIFICATION_TYPE,
} from '@/common';

export interface RestError {
  status?: RestError;
  code?: string;
  message?: string;
  messageParams?: Record<string, unknown>;
}

export type RestResponse<T = Record<string, unknown>> = RestError & T;

export interface Attachment {
  id: string;
  url: string;
  name?: string;
  size?: number;
  type?: string;
  thumbnailUrl?: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ChatRoom extends BaseEntity {
  name: string;
  description?: string;
  memberIds: string[];
  messages: string[];
  avatarUrl?: string;
  isPrivate?: boolean;
  ownerId?: string;
  lastMessageId?: string;
  unreadCount?: number;
  type?: CHAT_ROOM_TYPE;
  topic?: string;
  pinnedMessageIds?: string[];
  isOnline?: boolean;
  lastTimestamp?: Date;
}

export interface Sender
  extends Omit<BaseEntity, 'createdAt' | 'updatedAt' | 'deletedAt'> {
  id: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface Message extends BaseEntity {
  roomId: string;
  sender: Sender;
  content: string;
  type?: MESSAGE_TYPE;
  attachments?: Attachment[];
  replyToId?: string;
  reactions?: Reaction[];
  isEdited?: boolean;
  editedAt?: string;
  readBy?: Sender[];
  status?: MESSAGE_STATUS;
}

export interface User extends BaseEntity {
  username: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  passwordHash?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  gender?: GENDER;
  dateOfBirth?: Date;
  isOnline?: boolean;
  lastActiveAt?: Date;
  roles?: string[];
  isVerified?: boolean;
  isBanned?: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  settings?: Record<string, unknown>;
}

export interface NotificationItem extends BaseEntity {
  name: string;
  message: string;
  isUnread?: boolean;
  type: NOTIFICATION_TYPE;
  icon?: string;
  link?: string;
  readAt?: Date | null;
  metadata?: Record<string, any>;
}
