/* eslint-disable prettier/prettier */
import * as yup from 'yup';

export const commonSchema = {
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),

  email: yup.string().email('Invalid email').required('Email is required'),

  phoneNumber: yup
    .string()
    .optional()
    .matches(/^(?:\+?\d{8,15})?$/, 'Invalid phone number'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters'),

  confirmPassword: (ref: string = 'password') =>
    yup
      .string()
      .oneOf([yup.ref(ref)], 'Passwords do not match')
      .required('Please confirm your password'),

  dateOfBirth: yup
    .date()
    .typeError('Invalid date')
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),

  avatarFile: yup
    .mixed<File>()
    .test('fileSize', 'Image must be smaller than 2MB', (file) =>
      file ? file.size <= 2 * 1024 * 1024 : true,
    )
    .test('fileType', 'Unsupported format', (file) =>
      file ? ['image/jpeg', 'image/png'].includes(file.type) : true,
    ),
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const phoneRegex = /^[0-9]{9,11}$/;
