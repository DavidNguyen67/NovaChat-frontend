/* eslint-disable prettier/prettier */

import { NotificationItem } from '@/interfaces/response';
import { NOTIFICATION_TYPE } from '@/common';

export const TYPE_NOTIFICATION_COLOR_MAPPING: Record<
  NotificationItem['type'],
  string
> = {
  [NOTIFICATION_TYPE.INFO]: 'text-blue-500',
  [NOTIFICATION_TYPE.WARNING]: 'text-yellow-500',
  [NOTIFICATION_TYPE.SUCCESS]: 'text-green-500',
  [NOTIFICATION_TYPE.ERROR]: 'text-red-500',
  [NOTIFICATION_TYPE.SYSTEM]: 'text-gray-500',
  [NOTIFICATION_TYPE.MENTION]: 'text-purple-500',
  [NOTIFICATION_TYPE.MESSAGE]: 'text-indigo-500',
};

// export const fakeNotifications: NotificationItem[] = Array.from(
//   { length: 30 },
//   (_, i) => {
//     const typeList = [
//       NOTIFICATION_TYPE.INFO,
//       NOTIFICATION_TYPE.WARNING,
//       NOTIFICATION_TYPE.SUCCESS,
//       NOTIFICATION_TYPE.ERROR,
//       NOTIFICATION_TYPE.MENTION,
//       NOTIFICATION_TYPE.MESSAGE,
//     ] as const;
//     const type = faker.helpers.arrayElement(typeList);
//     const icons: Record<(typeof typeList)[number], string> = {
//       [NOTIFICATION_TYPE.INFO]: 'mdi:information-outline',
//       [NOTIFICATION_TYPE.WARNING]: 'mdi:alert-outline',
//       [NOTIFICATION_TYPE.SUCCESS]: 'mdi:check-circle-outline',
//       [NOTIFICATION_TYPE.ERROR]: 'mdi:close-circle-outline',
//       [NOTIFICATION_TYPE.MENTION]: 'mdi:at',
//       [NOTIFICATION_TYPE.MESSAGE]: 'mdi:message-outline',
//     };

//     return {
//       id: faker.string.uuid(),
//       name: faker.person.fullName(),
//       message: faker.lorem.sentence(),
//       isUnread: faker.datatype.boolean(),
//       type,
//       icon: icons[type],
//       link: faker.internet.url(),
//       createdAt: faker.date.recent({ days: 10 }),
//       updatedAt: faker.date.recent(),
//       readAt: faker.datatype.boolean() ? faker.date.recent() : null,
//       metadata: {
//         postId: faker.number.int({ min: 1, max: 1000 }),
//       },
//     };
//   },
// );
