/* eslint-disable prettier/prettier */

import {
  Attachment,
  CHAT_ROOM_TYPE,
  MESSAGE_STATUS,
  MESSAGE_TYPE,
  Reaction,
} from '@/common';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ChatRoom extends BaseEntity {
  name: string;
  description?: string;
  members: string[]; // Danh sách userId hoặc username
  messages: string[]; // Danh sách messageId hoặc Message[]
  avatarUrl?: string; // Ảnh đại diện phòng
  isPrivate?: boolean; // Phòng riêng tư hay không
  ownerId?: string; // ID người tạo phòng
  lastMessageId?: string; // ID tin nhắn cuối cùng
  unreadCount?: number; // Số tin chưa đọc (cho từng user nếu cần)
  type?: CHAT_ROOM_TYPE; // Loại phòng: nhóm hay 1-1
  topic?: string; // Chủ đề phòng (nếu có)
  pinnedMessageIds?: string[]; // Tin nhắn ghim
}

export interface Message extends BaseEntity {
  roomId: string; // ID của phòng chat
  senderId: string; // ID người gửi
  content: string; // Nội dung tin nhắn (text)
  type?: MESSAGE_TYPE; // Loại tin nhắn: text, image, video, file, system, ...
  attachments?: Attachment[]; // File đính kèm (ảnh, video, file, v.v.)
  replyToId?: string; // ID tin nhắn được trả lời (nếu có)
  reactions?: Reaction[]; // Danh sách emoji reactions
  isEdited?: boolean; // Đã chỉnh sửa chưa
  editedAt?: string; // Thời gian chỉnh sửa
  readBy?: string[]; // Danh sách userId đã đọc
  status?: MESSAGE_STATUS; // Trạng thái gửi (sending, sent, delivered, read)
}
