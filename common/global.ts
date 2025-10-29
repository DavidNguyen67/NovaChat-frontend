/* eslint-disable prettier/prettier */
export const GLOBAL_SESSION_INFO = 'GLOBAL_SESSION_INFO';

export const GLOBAL_CHAT_ROOM_KEY = 'GLOBAL_CHAT_ROOM_KEY';

import { Dayjs } from 'dayjs';
type DateType = string | number | Date | Dayjs;

declare module 'dayjs' {
  interface Dayjs {
    fromNow(withoutSuffix?: boolean): string;
    from(compared: DateType, withoutSuffix?: boolean): string;
    toNow(withoutSuffix?: boolean): string;
    to(compared: DateType, withoutSuffix?: boolean): string;
  }
}
