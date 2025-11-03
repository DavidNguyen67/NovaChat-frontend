import { METHOD } from '@/common';
import { useMutation } from '@/hooks/swr';
import { Friend } from '@/interfaces/response';

export const useFriendSlider = () => {
  const listFriends = useMutation<Friend[]>('/api/v1/friends/', {
    method: METHOD.GET,
  });

  return {
    listFriends,
  };
};
