/* eslint-disable prettier/prettier */
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const fakeFriends = (count: number = 20) =>
  Array.from({ length: count }, (_, i) => ({
    id: v4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    avatarUrl: faker.image.avatarGitHub(),
    fullName: faker.person.fullName(),
  }));
