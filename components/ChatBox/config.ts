/* eslint-disable prettier/prettier */
import { Message } from '@/interfaces/response';

export interface ForwardModalData {
  message?: Message;
  isOpen?: boolean;
}

export interface DeleteModeData {
  isDeleteMode: boolean;
  selectedMessages: Message[];
}
