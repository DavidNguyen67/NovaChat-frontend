/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';

import { ChatRoom } from '@/interfaces/response';
import { CHAT_ROOM_TYPE } from '@/common';

export const mockChatRoomList: ChatRoom[] = Array.from({ length: 20 }).map(
  () => {
    const isPrivate = faker.datatype.boolean();
    const type = faker.helpers.arrayElement([
      CHAT_ROOM_TYPE.PRIVATE,
      CHAT_ROOM_TYPE.GROUP,
      CHAT_ROOM_TYPE.CHANNEL,
    ]);

    return {
      id: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),

      name:
        type === CHAT_ROOM_TYPE.PRIVATE
          ? faker.person.fullName()
          : faker.company.name(),

      description:
        type === CHAT_ROOM_TYPE.GROUP ? faker.lorem.sentence() : undefined,

      memberIds: Array.from(
        { length: faker.number.int({ min: 2, max: 8 }) },
        () => faker.string.uuid(),
      ),
      messages: Array.from(
        { length: faker.number.int({ min: 3, max: 20 }) },
        () => faker.string.uuid(),
      ),

      avatarUrl: faker.image.avatarGitHub(),
      isPrivate,
      ownerId: faker.string.uuid(),
      lastMessageId: faker.string.uuid(),
      unreadCount: faker.number.int({ min: 0, max: 15 }),
      type,
      topic:
        type === CHAT_ROOM_TYPE.CHANNEL
          ? faker.hacker.ingverb() + ' ' + faker.hacker.noun()
          : undefined,
      pinnedMessageIds: faker.helpers.arrayElements(
        Array.from({ length: 20 }, () => faker.string.uuid()),
        faker.number.int({ min: 0, max: 3 }),
      ),
      isOnline: isPrivate ? faker.datatype.boolean() : undefined,
      lastTimestamp: faker.date.recent({ days: 2 }),
    } satisfies ChatRoom;
  },
);
