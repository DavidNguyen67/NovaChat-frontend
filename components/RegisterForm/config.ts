/* eslint-disable prettier/prettier */
import { CalendarDate } from '@heroui/react';
import * as yup from 'yup';

import { commonSchema } from '@/common';

export const registerSchema = yup.object({
  fullName: commonSchema.fullName,
  email: commonSchema.email,
  phoneNumber: commonSchema.phoneNumber,
  password: commonSchema.password,
  confirmPassword: commonSchema.confirmPassword(),
  dateOfBirth: commonSchema.dateOfBirth,
  gender: yup
    .mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .nullable(),
  avatarUrl: yup.string().url('Invalid avatar URL').nullable(),
  bio: yup.string().max(300, 'Bio must be under 300 characters').optional(),
  avatarFile: commonSchema.avatarFile,
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;

export const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const convertCalendarDateToJSDate = (date: CalendarDate) => {
  return new Date(date.year, date.month - 1, date.day);
};
