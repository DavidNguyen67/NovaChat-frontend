/* eslint-disable prettier/prettier */
'use client';
import { getLocalTimeZone, today } from '@internationalized/date';
import React, { useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  DatePicker,
  Form,
  Input,
  Select,
  SelectItem,
  Spinner,
} from '@heroui/react';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { v4 } from 'uuid';
import clsx from 'clsx';
import _ from 'lodash';

import AvatarCropModal from '../AvatarCropModal';
import Loader from '../Loader';

import {
  base64ToFile,
  convertCalendarDateToJSDate,
  RegisterFormValues,
  registerSchema,
} from './config';

import { useAccount } from '@/hooks/auth/useAccount';
import { useModal } from '@/hooks/useModal';
import { useFile } from '@/hooks/useFile';
import { useAuth } from '@/hooks/auth/useAuth';
import { emailRegex } from '@/common/validator';
import { useDebounceCallBack } from '@/hooks/useDebounceCallBack';
import { ApiError } from '@/interfaces';

const RegisterForm = () => {
  const { register } = useAccount();

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const { checkEmail } = useAuth();

  const { uploadFile } = useFile();

  const cropModal = useModal<string>();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const prevFile = useRef<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const initialValues = useRef<RegisterFormValues>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: undefined as any,
    gender: undefined as any,
    avatarUrl: undefined,
  });

  const debounceDelay = useRef<number>(500);

  const checkEmailDebounced = useDebounceCallBack(async (email: string) => {
    try {
      const response = await checkEmail.trigger({ email });

      return response;
    } catch (error: any) {
      const apiError: ApiError = error;

      formik.setFieldError(
        'email',
        error.message || 'Failed to validate email',
      );

      throw apiError;
    }
  }, debounceDelay.current);

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const email = event.target.value.trim();

    formik.handleChange(event);

    const isEmail = emailRegex.test(email);

    if (!isEmail) {
      formik.validateField('email');

      return;
    }
    setIsCheckingEmail(true);

    const response = await checkEmailDebounced(email);

    const isValid = response.data;

    if (!isValid) {
      formik.setFieldError('email', 'Email is already in use');
    }
    setIsCheckingEmail(false);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const payload: RegisterFormValues = _.cloneDeep(values);

      payload.dateOfBirth = convertCalendarDateToJSDate(
        payload.dateOfBirth as any,
      );

      const file = payload.avatarFile;

      if (file) {
        const formData = new FormData();

        formData.append('file', file);

        const response = await uploadFile.trigger(formData);

        delete payload.avatarFile;

        payload.dateOfBirth = convertCalendarDateToJSDate(
          payload.dateOfBirth as any,
        );

        if (response) {
          formik.setFieldValue('avatarUrl', response);
        }
      }

      await register(payload);
    } catch (error) {}
  };

  const formik = useFormik<RegisterFormValues>({
    validationSchema: registerSchema,
    initialValues: initialValues.current,
    onSubmit,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleAvatarChange = (file: File) => {
    if (file) {
      prevFile.current = file;
      formik.setFieldTouched('avatarFile', true);

      formik.setFieldValue('avatarFile', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onCropDone = (croppedImage: string) => {
    const croppedFile = base64ToFile(
      croppedImage,
      prevFile.current?.name ?? `${v4()}.png`,
    );

    handleAvatarChange(croppedFile);
  };

  return (
    <div className="flex justify-center items-center flex-1">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-[400px] max-w-full"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Loader
          className="h-[640px] flex flex-col"
          isLoading={formik.isSubmitting}
        >
          <Card className="flex flex-col flex-1 overflow-hidden h-full backdrop-blur-xl bg-white/10 dark:bg-gray-800/40 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
            <div className="p-6 border-b border-white/10 text-center">
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Create an Account
                </span>
                ✨
              </h2>
            </div>

            <CardBody className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
              <Form
                className="flex flex-col gap-5 pb-3"
                onSubmit={formik.handleSubmit}
              >
                <div
                  className={clsx(
                    'flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 w-fit transition-all mx-auto backdrop-blur-sm bg-white/5 hover:bg-white/10 cursor-pointer',
                    formik?.touched?.avatarFile && formik.errors.avatarFile
                      ? 'border-pink-500/70'
                      : 'border-transparent',
                  )}
                >
                  <Avatar
                    className={clsx(
                      'size-20 cursor-pointer ring-2 transition-all duration-300',
                      formik?.touched?.avatarFile && formik.errors.avatarFile
                        ? 'ring-pink-500 hover:ring-pink-400'
                        : 'ring-primary hover:ring-primary/80',
                    )}
                    src={avatarPreview!}
                    onClick={(event) => {
                      if (avatarPreview) cropModal.handleShow(avatarPreview);
                      else avatarInputRef.current?.click();
                      event.stopPropagation();
                      event.preventDefault();
                    }}
                  />

                  <label
                    className={clsx(
                      'mt-2 text-sm font-medium cursor-pointer hover:underline transition-colors',
                      formik?.touched?.avatarFile && formik.errors.avatarFile
                        ? 'text-pink-500'
                        : 'text-primary',
                    )}
                    htmlFor="avatar"
                  >
                    Upload avatar
                  </label>

                  <input
                    ref={avatarInputRef}
                    accept="image/*"
                    className="hidden"
                    id="avatar"
                    name="avatarFile"
                    type="file"
                    onChange={(event) =>
                      handleAvatarChange(event.target.files![0])
                    }
                  />

                  {formik?.touched?.avatarFile && formik.errors.avatarFile && (
                    <p className="text-pink-500 text-xs mt-1">
                      {formik.errors.avatarFile}
                    </p>
                  )}
                </div>

                <Input
                  errorMessage={
                    formik.touched.fullName ? formik.errors.fullName : undefined
                  }
                  isInvalid={
                    !!(formik.touched.fullName && formik.errors.fullName)
                  }
                  name="fullName"
                  placeholder="Full name"
                  radius="lg"
                  startContent={
                    <Icon
                      className="text-primary text-xl"
                      icon="mdi:account-outline"
                    />
                  }
                  value={formik.values.fullName}
                  variant="bordered"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                <Input
                  endContent={
                    formik.values.email &&
                    !formik.errors.email &&
                    (checkEmail.isMutating ? (
                      <Spinner className="text-primary" size="sm" />
                    ) : checkEmail.error ? null : (
                      <Icon
                        className="text-green-500 text-xl"
                        icon="mdi:check-circle-outline"
                      />
                    ))
                  }
                  errorMessage={
                    formik.touched.email ? formik.errors.email : undefined
                  }
                  isInvalid={!!(formik.touched.email && formik.errors.email)}
                  name="email"
                  placeholder="Email address"
                  radius="lg"
                  startContent={
                    <Icon
                      className="text-primary text-xl"
                      icon="mdi:email-outline"
                    />
                  }
                  value={formik.values.email}
                  variant="bordered"
                  onBlur={formik.handleBlur}
                  onChange={handleEmailChange}
                />

                <Input
                  errorMessage={
                    formik.touched.phoneNumber
                      ? formik.errors.phoneNumber
                      : undefined
                  }
                  isInvalid={
                    !!(formik.touched.phoneNumber && formik.errors.phoneNumber)
                  }
                  name="phoneNumber"
                  placeholder="Phone number (optional)"
                  radius="lg"
                  startContent={
                    <Icon
                      className="text-primary text-xl"
                      icon="mdi:phone-outline"
                    />
                  }
                  value={formik.values.phoneNumber}
                  variant="bordered"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                <DatePicker
                  aria-label="dateOfBirth"
                  errorMessage={
                    formik.touched.dateOfBirth
                      ? (formik.errors.dateOfBirth as string)
                      : undefined
                  }
                  isInvalid={
                    !!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)
                  }
                  label="Date of Birth"
                  maxValue={today(getLocalTimeZone())}
                  radius="lg"
                  selectorButtonPlacement="start"
                  selectorIcon={
                    <div className="text-primary text-xl">
                      <Icon
                        className="text-primary text-xl"
                        icon="mdi:calendar-month-outline"
                      />
                    </div>
                  }
                  value={formik.values.dateOfBirth as any}
                  variant="bordered"
                  visibleMonths={2}
                  onBlur={() => formik.setFieldTouched('dateOfBirth', true)}
                  onChange={(value) =>
                    formik.setFieldValue('dateOfBirth', value)
                  }
                />

                <Select
                  aria-label="gender"
                  classNames={{
                    trigger:
                      'border-default-200 hover:border-default-400 cursor-pointer',
                  }}
                  errorMessage={
                    formik.touched.gender ? formik.errors.gender : undefined
                  }
                  isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                  label="Select your gender"
                  name="gender"
                  placeholder="Choose your gender"
                  radius="lg"
                  selectedKeys={
                    formik.values.gender ? [formik.values.gender] : []
                  }
                  selectorIcon={<span />}
                  startContent={
                    <div className="text-primary text-xl">
                      <Icon
                        className="text-primary text-xl"
                        icon="mdi:gender-male-female"
                      />
                    </div>
                  }
                  variant="bordered"
                  onBlur={() => formik.setFieldTouched('gender', true)}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    formik.setFieldValue('gender', selected);
                  }}
                >
                  <SelectItem key="male">Male</SelectItem>
                  <SelectItem key="female">Female</SelectItem>
                  <SelectItem key="other">Other</SelectItem>
                </Select>

                <Input
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      <Icon
                        className="text-default-500 text-xl cursor-pointer"
                        icon={
                          showPassword
                            ? 'mdi:eye-off-outline'
                            : 'mdi:eye-outline'
                        }
                      />
                    </button>
                  }
                  errorMessage={
                    formik.touched.password ? formik.errors.password : undefined
                  }
                  isInvalid={
                    !!(formik.touched.password && formik.errors.password)
                  }
                  name="password"
                  placeholder="Password"
                  radius="lg"
                  startContent={
                    <Icon
                      className="text-primary text-xl"
                      icon="mdi:lock-outline"
                    />
                  }
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  variant="bordered"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                <Input
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                    >
                      <Icon
                        className="text-default-500 text-xl cursor-pointer"
                        icon={
                          showConfirm
                            ? 'mdi:eye-off-outline'
                            : 'mdi:eye-outline'
                        }
                      />
                    </button>
                  }
                  errorMessage={
                    formik.touched.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                  isInvalid={
                    !!(
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    )
                  }
                  name="confirmPassword"
                  placeholder="Confirm password"
                  radius="lg"
                  startContent={
                    <Icon
                      className="text-primary text-xl"
                      icon="mdi:lock-check-outline"
                    />
                  }
                  type={showConfirm ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  variant="bordered"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                <Button
                  className={clsx(
                    'w-full font-semibold text-lg shadow-md transition-transform rounded-lg',
                    'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    'disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-200',
                  )}
                  color="primary"
                  disabled={isCheckingEmail}
                  radius="lg"
                  startContent={<Icon icon="mdi:account-plus-outline" />}
                  type="submit"
                >
                  Sign up
                </Button>
              </Form>
            </CardBody>

            <div className="p-4 border-t border-white/10 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                className="text-primary font-medium hover:underline"
                href="/login"
              >
                Log in
              </Link>
            </div>
          </Card>
        </Loader>
      </motion.div>

      <AvatarCropModal
        imageSrc={cropModal.data!}
        open={cropModal.isOpen!}
        onClose={cropModal.handleHide}
        onCropDone={onCropDone}
      />
    </div>
  );
};

export default RegisterForm;
