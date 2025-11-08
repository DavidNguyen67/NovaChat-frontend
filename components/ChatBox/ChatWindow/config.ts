/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';

import { MESSAGE_STATUS, MESSAGE_TYPE } from '@/common';
import { Message, Sender } from '@/interfaces/response';

export const seedMessages = (
  roomIds: string[],
  userIds: string[],
  currentIndex = 0,
  count = 10,
): Message[] => {
  return Array.from({ length: count }, (_, index) => {
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
    const content = 'Content' + (currentIndex + index);

    return {
      id: faker.string.uuid(),
      roomId,
      sender,
      content,
      type: hasAttachment ? MESSAGE_TYPE.IMAGE : MESSAGE_TYPE.TEXT,
      attachments: hasAttachment
        ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
            const fileKinds = [
              {
                mime: 'image/jpeg',
                gen: () => ({
                  url: faker.image.url({ width: 400, height: 300 }),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'application/pdf',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'application/zip',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                  size: faker.number.int({ min: 500_000, max: 5_000_000 }),
                }),
              },
              {
                mime: 'video/mp4',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                  size: faker.number.int({ min: 2_000_000, max: 20_000_000 }),
                  thumbnailUrl: faker.image.url({ width: 400, height: 250 }),
                }),
              },
              {
                mime: 'text/javascript',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'text/html',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'text/css',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'text/x-python',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'text/x-c++src',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'text/x-java-source',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'application/json',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'application/x-sh',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
              {
                mime: 'application/x-yaml',
                gen: () => ({
                  url: faker.internet.url(),
                  name: faker.system.fileName({}),
                }),
              },
            ];

            const chosen = faker.helpers.arrayElement(fileKinds);
            const file = chosen.gen();

            return {
              id: faker.string.uuid(),
              url: file.url,
              name: file.name,
              type: chosen.mime,
              size: faker.number.int({ min: 50_000, max: 5_000_000 }),
            };
          })
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
