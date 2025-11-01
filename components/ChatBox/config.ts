/* eslint-disable prettier/prettier */

import { Message } from '@/interfaces/response';

export interface SelectedModeData {
  isSelectMode?: boolean;
  selectedMessages: Message[];
  mode?: 'delete' | 'forward' | 'unknown';
  isOpenModal?: boolean;
}
