/* eslint-disable prettier/prettier */

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

export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum NOTIFICATION_TYPE {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  SYSTEM = 'SYSTEM',
  MENTION = 'MENTION',
  MESSAGE = 'MESSAGE',
}
