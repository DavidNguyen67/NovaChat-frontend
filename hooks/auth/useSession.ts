import useSWR from 'swr';

import { GLOBAL_ACCOUNT_INFO } from '@/common/global';
import { SessionInfo } from '@/interfaces/response';

export const useSession = () => {
  const sessionInfo = useSWR<SessionInfo | null>(GLOBAL_ACCOUNT_INFO);

  return {
    sessionInfo,
  };
};
