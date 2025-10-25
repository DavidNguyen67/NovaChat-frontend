/* eslint-disable prettier/prettier */
export interface Message {
  id: string;
  author: string;
  text: string;
  time?: string;
  self?: boolean;
}
