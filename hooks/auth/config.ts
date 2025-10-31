/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';

import { User } from '@/interfaces/response';

export const mockUser: User = {
  id: faker.string.uuid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  username: faker.internet.username(),
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.number(),
  passwordHash: faker.internet.password(),
  avatarUrl: faker.image.avatar(),
  coverUrl: faker.image.url(),
  bio: faker.lorem.sentence(),
  gender: faker.helpers.arrayElement(['male', 'female', 'other']),
  dateOfBirth: faker.date.birthdate({ min: 18, max: 40, mode: 'age' }),
  isOnline: faker.datatype.boolean(),
  lastActiveAt: faker.date.recent({ days: 3 }),
  roles: faker.helpers.arrayElements(['user', 'admin', 'moderator'], {
    min: 1,
    max: 2,
  }),
  isVerified: faker.datatype.boolean(),
  isBanned: faker.datatype.boolean(),
  theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
  language: faker.helpers.arrayElement(['en', 'vi', 'ja', 'fr']),
  settings: {
    notifications: faker.datatype.boolean(),
    darkMode: faker.datatype.boolean(),
  },
};
