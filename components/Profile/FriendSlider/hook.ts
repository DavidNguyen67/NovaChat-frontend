/* eslint-disable prettier/prettier */
import { METHOD } from '@/common';
import { useMutation } from '@/hooks/swr';
import { Friend } from '@/interfaces/response';

export const useFriendSlider = () => {
  const friendsList = useMutation<Friend[]>('/api/v1/friends', {
    url: '/api/v1/friends',
    method: METHOD.GET,
    extraHeader: {
      authorization: 'as',
    },
  });

  return {
    friendsList,
  };
};
