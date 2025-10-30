/* eslint-disable prettier/prettier */
import { useMutation } from './swr';

import { METHOD } from '@/common';

export const useFile = () => {
  const uploadFile = useMutation<string>('/files/upload', {
    method: METHOD.POST,
  });

  return {
    uploadFile,
  };
};
