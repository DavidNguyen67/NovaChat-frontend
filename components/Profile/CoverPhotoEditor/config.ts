/* eslint-disable prettier/prettier */
import * as yup from 'yup';

import { commonSchema } from '@/common/validator';

export const coverPhotoSchema = yup.object({
  avatarFile: commonSchema.avatarFile,
});

export type CoverPhotoFormValues = yup.InferType<typeof coverPhotoSchema>;

