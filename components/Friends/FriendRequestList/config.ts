/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

import { Friend } from '@/interfaces/response';

export const mockFriendRequests = (count: number = 4): Friend[] =>
  Array.from({ length: count }, () => ({
    id: v4(),
    fullName: faker.person.fullName(),
    avatarUrl: faker.image.avatarGitHub(),
    createdAt: new Date(),
    followers: faker.number.int({ min: 0, max: 10000 }),
    bio: faker.lorem.sentence(),
    mutualFriends: Array.from(
      { length: faker.number.int({ min: 0, max: 10 }) },
      () => ({
        id: v4(),
        fullName: faker.person.fullName(),
        avatarUrl: faker.image.avatarGitHub(),
        createdAt: new Date(),
        followers: faker.number.int({ min: 0, max: 10000 }),
        bio: faker.lorem.sentence(),
        mutualFriends: Array.from(
          { length: faker.number.int({ min: 0, max: 10 }) },
          () => ({
            id: v4(),
            fullName: faker.person.fullName(),
            avatarUrl: faker.image.avatarGitHub(),
            createdAt: new Date(),
            followers: faker.number.int({ min: 0, max: 10000 }),
            bio: faker.lorem.sentence(),
          }),
        ),
      }),
    ),
  }));
