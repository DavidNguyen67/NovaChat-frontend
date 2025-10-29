export enum CHAT_ROOM_TYPE {
  GROUP = 'group',
  DIRECT = 'direct',
}

export enum MESSAGE_TYPE {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  SYSTEM = 'system',
}

export enum MESSAGE_STATUS {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export interface Attachment {
  id: string;
  url: string;
  name?: string;
  size?: number; // bytes
  type?: string; // MIME type (vd: image/png)
  thumbnailUrl?: string;
}

export interface Reaction {
  emoji: string; // vd: "❤️" hoặc ":thumbsup:"
  userIds: string[]; // Danh sách người đã thả reaction đó
}
