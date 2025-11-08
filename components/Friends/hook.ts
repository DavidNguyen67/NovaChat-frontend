/* eslint-disable prettier/prettier */
import { METHOD } from '@/common';
import { useMutation } from '@/hooks/swr';
import { Friend } from '@/interfaces/response';

export const useFriends = () => {
  const friendRequestsList = useMutation<Friend[]>('/api/v1/friend-requests', {
    url: '/api/v1/friend-requests',
    method: METHOD.GET,
  });

  const friendSuggestionsList = useMutation<Friend[]>(
    '/api/v1/friend-suggestions',
    {
      url: '/api/v1/friend-suggestions',
      method: METHOD.GET,
    },
  );

  return {
    friendRequestsList,
    friendSuggestionsList,
  };
};
