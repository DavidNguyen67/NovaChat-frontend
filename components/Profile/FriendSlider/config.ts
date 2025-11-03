import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

import { Friend } from '@/interfaces/response';

export const fakeFriends: Friend[] = Array.from({ length: 30 }, (_, i) => ({
  id: v4(),
  createdAt: new Date(),
  updatedAt: new Date(),
  avatarUrl: faker.image.avatarGitHub(),
  fullName: faker.person.fullName(),
}));
