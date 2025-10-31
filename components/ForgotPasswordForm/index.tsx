/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardBody, Form, Input, InputOtp } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';

import Loader from '../Loader';

import { ForgotPasswordFormValues, FORM_STEP } from './config';

import { useAuth } from '@/hooks/auth/useAuth';
import { emailRegex, phoneRegex } from '@/common';
import { ApiResponse } from '@/interfaces';

const searchSchema = yup.object({
  username: yup
    .string()
    .required('Please enter your email or phone number')
    .test('is-valid', 'Invalid email or phone number', (v) => {
      if (!v) return false;

      return emailRegex.test(v) || phoneRegex.test(v);
    }),
});

const otpSchema = yup.object({
  otp: yup
    .string()
    .required('Please enter the OTP code')
    .matches(/^\d{6}$/, 'OTP must be 6 digits'),
});

const ForgotPasswordForm = () => {
  const router = useRouter();

  const { forgotPassword, verifyOtp } = useAuth();

  const [step, setStep] = useState<FORM_STEP>(FORM_STEP.SEARCH);

  const [userIdentifier, setUserIdentifier] = useState<string>('');

  const [countdown, setCountdown] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initialValues = useRef<ForgotPasswordFormValues>({
    username: '',
    otp: '',
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      if (step === FORM_STEP.SEARCH) {
        await forgotPassword.trigger({});

        setUserIdentifier(values.username);
        setStep(FORM_STEP.OTP);
        startCountdown(60);
      } else if (step === FORM_STEP.OTP) {
        const verified = await verifyOtp.trigger({});

        if (verified) {
        } else {
          formik.setFieldError('otp', 'Invalid OTP code');
        }
      }
    } catch (er: unknown) {
      const error = er as ApiResponse<any>;

      if (step === FORM_STEP.SEARCH) {
        formik.setFieldError(
          'username',
          error.error?.message || 'An error occurred while searching',
        );
      }
      if (step === FORM_STEP.OTP) {
        formik.setFieldError(
          'otp',
          error.error?.message || 'An error occurred while verifying OTP',
        );
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      await forgotPassword.trigger({ username: userIdentifier });
      startCountdown(60);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const formik = useFormik<ForgotPasswordFormValues>({
    validationSchema: step === FORM_STEP.SEARCH ? searchSchema : otpSchema,
    initialValues: initialValues.current,
    onSubmit,
    validateOnBlur: true,
    validateOnChange: true,
  });

  return (
    <div className="relative flex min-h-screen flex-col justify-center items-center bg-background text-foreground p-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Loader isLoading={formik.isSubmitting || forgotPassword.isMutating}>
          <Card className="shadow-lg rounded-2xl border border-divider bg-content1 backdrop-blur-md">
            <CardBody className="p-8 flex flex-col gap-5">
              <div className="flex w-full relative">
                {step === FORM_STEP.OTP && (
                  <div
                    className="absolute top-0 left-0 transform -translate-y-1/2 cursor-pointer flex items-center gap-1"
                    onClick={() => setStep(FORM_STEP.SEARCH)}
                  >
                    <Icon icon="mdi:arrow-left" />
                    Back
                  </div>
                )}

                <h2 className="text-2xl font-semibold text-primary text-center w-full">
                  {step === FORM_STEP.SEARCH
                    ? 'Find Your Account'
                    : 'Enter OTP Code'}
                </h2>
              </div>

              {step === FORM_STEP.SEARCH ? (
                <p className="text-center text-sm text-default-500">
                  Please enter your email address or mobile number to search for
                  your account.
                </p>
              ) : (
                <p className="text-center text-sm text-default-500">
                  We've sent a 6-digit OTP to{' '}
                  <span className="font-medium">{userIdentifier}</span>.
                </p>
              )}

              <Form
                className="flex flex-col gap-4 items-end"
                onSubmit={formik.handleSubmit}
              >
                {step === FORM_STEP.SEARCH ? (
                  <Input
                    errorMessage={
                      formik.touched.username
                        ? formik.errors.username
                        : undefined
                    }
                    isInvalid={
                      !!(formik.touched.username && formik.errors.username)
                    }
                    name="username"
                    placeholder="Email address or mobile number"
                    radius="lg"
                    startContent={
                      <Icon
                        className="text-primary text-xl"
                        icon="mdi:account-search-outline"
                      />
                    }
                    value={formik.values.username}
                    variant="bordered"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <InputOtp
                      classNames={{
                        base: 'w-full items-center justify-center',
                        errorMessage: 'font-bold text-sm',
                        segmentWrapper: 'p-0',
                      }}
                      errorMessage={
                        formik.touched.otp ? formik.errors.otp : undefined
                      }
                      isInvalid={!!(formik.touched.otp && formik.errors.otp)}
                      length={6}
                      name="otp"
                      radius="lg"
                      value={formik.values.otp}
                      variant="bordered"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />

                    <div className="flex justify-center text-sm text-default-500">
                      {countdown > 0 ? (
                        <span>Resend OTP in {countdown}s</span>
                      ) : (
                        <Button
                          color="primary"
                          size="sm"
                          variant="light"
                          onPress={handleResendOtp}
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center w-full">
                  <Button
                    className="font-semibold text-base min-w-[8rem]"
                    color="primary"
                    isLoading={formik.isSubmitting}
                    radius="lg"
                    startContent={
                      <Icon
                        icon={
                          step === FORM_STEP.SEARCH
                            ? 'mdi:magnify'
                            : 'mdi:check'
                        }
                      />
                    }
                    type="submit"
                  >
                    {step === FORM_STEP.SEARCH ? 'Search' : 'Verify'}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      className="font-semibold text-base"
                      color="warning"
                      radius="lg"
                      startContent={<Icon icon="mdi:login" />}
                      type="button"
                      variant="flat"
                      onPress={() => router.push('/login')}
                    >
                      Log in
                    </Button>

                    <Button
                      className="font-semibold text-base"
                      color="success"
                      radius="lg"
                      startContent={<Icon icon="mdi:account-plus-outline" />}
                      type="button"
                      variant="flat"
                      onPress={() => router.push('/register')}
                    >
                      Sign up
                    </Button>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Loader>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;
