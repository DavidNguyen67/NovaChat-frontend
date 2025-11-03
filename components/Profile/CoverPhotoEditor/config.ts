/* eslint-disable prettier/prettier */
import * as yup from 'yup';

import { commonSchema } from '@/common/validator';

export const coverPhotoSchema = yup.object({
  avatarFile: commonSchema.avatarFile,
});

export type CoverPhotoFormValues = yup.InferType<typeof coverPhotoSchema>;

export const blobUrlToFile = (blobUrl: string): Promise<File> =>
  new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        const file = new File([blob], 'file.extension', { type: blob.type });

        resolve(file);
      });
    });
  });
