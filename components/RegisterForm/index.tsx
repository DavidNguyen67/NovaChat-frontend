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
  Radio,
  RadioGroup,
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
import { emailRegex } from '@/common';

const RegisterForm = () => {
  const { register } = useAccount();

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
    gender: 'male',
    avatarUrl: undefined,
  });

  const debounceDelay = useRef<number>(500);

  const checkEmailDebounced = _.debounce(async (email: string) => {
    const response = await checkEmail.trigger({ email });

    return response;
  }, debounceDelay.current);

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const email = event.target.value.trim();

      formik.handleChange(event);

      const isEmail = emailRegex.test(email);

      if (!isEmail) {
        formik.validateField('email');

        return;
      }

      const isValid = await checkEmailDebounced(email);

      if (!isValid) {
        formik.setFieldError('email', 'Email is already in use');
      }
    } catch (error) {
      console.log('[handleEmailChange] Check error', error);
      formik.setFieldError('email', 'Error checking email');
    }
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

    setAvatarPreview(croppedImage);
  };

  return (
    <div className="relative flex min-h-screen justify-center items-center bg-background text-foreground">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
      >
        <Loader
          className="h-[600px] flex flex-col"
          isLoading={formik.isSubmitting}
        >
          <Card className="shadow-lg rounded-2xl border border-divider bg-content1 backdrop-blur-md transition-colors duration-300 flex flex-col flex-1 overflow-hidden h-full">
            <div className="p-6 border-b border-divider text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary">
                Create an account
              </h2>
            </div>

            <CardBody className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
              <Form
                className="flex flex-col gap-5 pb-3"
                onSubmit={formik.handleSubmit}
              >
                <div
                  className={clsx(
                    'flex flex-col items-center justify-center border-2 rounded-xl p-4 w-fit transition-all mx-auto',
                    formik?.touched?.avatarFile && formik.errors.avatarFile
                      ? 'border-pink-500'
                      : 'border-transparent',
                  )}
                >
                  <Avatar
                    className={clsx(
                      'size-20 cursor-pointer ring-2 transition-all',
                      formik?.touched?.avatarFile && formik.errors.avatarFile
                        ? 'ring-pink-500 hover:ring-pink-400'
                        : 'ring-primary hover:ring-primary/80',
                    )}
                    src={avatarPreview!}
                    onClick={() => {
                      if (avatarPreview) cropModal.handleShow(avatarPreview);
                      else avatarInputRef.current?.click();
                    }}
                  />

                  <label
                    className={clsx(
                      'mt-2 text-sm font-medium cursor-pointer hover:underline',
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
                    !formik.errors.email && (
                      <>
                        {checkEmail.isMutating ? (
                          <Spinner className="text-primary" size="sm" />
                        ) : checkEmail.error ? null : (
                          <Icon
                            className="text-green-500 text-xl"
                            icon="mdi:check-circle-outline"
                          />
                        )}
                      </>
                    )
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
                  maxValue={today(getLocalTimeZone())}
                  name="dateOfBirth"
                  radius="lg"
                  selectorButtonPlacement="start"
                  selectorIcon={
                    <span className="text-primary">
                      <Icon
                        className="text-primary text-xl"
                        icon="mdi:calendar-month-outline"
                      />
                    </span>
                  }
                  value={formik.values.dateOfBirth as any}
                  variant="bordered"
                  visibleMonths={2}
                  onBlur={() => formik.setFieldTouched('dateOfBirth', true)}
                  onChange={(value) =>
                    formik.setFieldValue('dateOfBirth', value)
                  }
                />
                <RadioGroup
                  classNames={{
                    wrapper: 'justify-start gap-3',
                    base: 'w-full',
                  }}
                  errorMessage={
                    formik.touched.gender ? formik.errors.gender : undefined
                  }
                  isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                  label="Select your gender"
                  name="gender"
                  orientation="horizontal"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                  <Radio value="other">Other</Radio>
                </RadioGroup>
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
                  className="w-full font-semibold text-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  color="success"
                  radius="lg"
                  type="submit"
                >
                  <Icon icon="mdi:account-plus-outline" />
                  Sign up
                </Button>
              </Form>
            </CardBody>

            <div className="p-4 border-t border-divider text-center text-sm">
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
