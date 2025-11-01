/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';

import { MESSAGE_STATUS, MESSAGE_TYPE } from '@/common';
import { Message, Sender } from '@/interfaces/response';

export const seedMessages = (
  roomIds: string[],
  userIds: string[],
  count = 10,
): Message[] => {
  return Array.from({ length: count }, (_, i) => {
    const sender: Sender = {
      id: faker.helpers.arrayElement(userIds),
      username: faker.internet.username(),
      avatarUrl: faker.image.avatar(),
      fullName: faker.person.fullName(),
    };

    const readBy: Sender[] = Array.from(
      { length: faker.number.int({ min: 0, max: userIds.length }) },
      () => ({
        id: faker.helpers.arrayElement(userIds),
        username: faker.internet.username(),
        avatarUrl: faker.image.avatar(),
        fullName: faker.person.fullName(),
      }),
    );

    const roomId = faker.helpers.arrayElement(roomIds);

    const hasAttachment = faker.datatype.boolean();
    const hasReaction = faker.datatype.boolean();
    const isEdited = faker.datatype.boolean();
    const content = faker.lorem.sentence(faker.number.int({ min: 3, max: 15 }));

    return {
      id: faker.string.uuid(),
      roomId,
      sender,
      content,
      type: hasAttachment ? MESSAGE_TYPE.IMAGE : MESSAGE_TYPE.TEXT,
      attachments: hasAttachment
        ? [
            {
              id: faker.string.uuid(),
              url: faker.image.url({
                category: 'nature',
                width: 400,
                height: 300,
              }),
              name: faker.system.fileName(),
              type: 'image/jpeg',
              size: faker.number.int({ min: 50_000, max: 500_000 }),
            },
          ]
        : [],
      replyToId: faker.helpers.maybe(() => faker.string.uuid(), {
        probability: 0.1,
      }),
      reactions: hasReaction
        ? [
            {
              // match Reaction interface: emoji and userIds (array)
              emoji: faker.helpers.arrayElement(['👍', '❤️', '😂', '🔥', '😢']),
              userIds: [faker.helpers.arrayElement(userIds)],
            },
          ]
        : [],
      isEdited,
      editedAt: isEdited
        ? faker.date.recent({ days: 3 }).toISOString()
        : undefined,
      readBy,
      status: faker.helpers.arrayElement([
        MESSAGE_STATUS.SENT,
        MESSAGE_STATUS.DELIVERED,
        MESSAGE_STATUS.READ,
      ]),
      createdAt: faker.date.recent({ days: 7 }),
      updatedAt: faker.date.recent({ days: 1 }),
    };
  });
};
