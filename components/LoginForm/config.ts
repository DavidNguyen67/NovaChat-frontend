/* eslint-disable prettier/prettier */
import * as yup from 'yup';

import { commonSchema, emailRegex, phoneRegex } from '@/common/validator';

export const loginSchema = yup.object({
  username: yup
    .string()
    .required('Please enter your email or phone number')
    .test('is-valid', 'Invalid email or phone number format', (value) => {
      if (!value) return false;

      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: commonSchema.password,
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
