import useSWR from 'swr';

import { GLOBAL_SESSION_INFO } from '@/common/global';
import { User } from '@/interfaces/response';

/* eslint-disable prettier/prettier */
export const useSession = () => {
  const sessionInfo = useSWR<User>(GLOBAL_SESSION_INFO);

  const initUser = () => {};

  return {
    sessionInfo,
    initUser,
  };
};
