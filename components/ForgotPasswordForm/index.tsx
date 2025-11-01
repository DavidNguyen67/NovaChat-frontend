/* eslint-disable prettier/prettier */

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
import { ApiResponse } from '@/interfaces';
import { emailRegex, phoneRegex } from '@/common/validator';

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
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <button
        className="absolute -top-10 left-0 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition cursor-pointer hover:underline"
        onClick={() => router.push('/login')}
      >
        <Icon className="text-base" icon="mdi:arrow-left" />
        Back to login
      </button>

      <Loader isLoading={formik.isSubmitting || forgotPassword.isMutating}>
        <Card className="rounded-2xl border border-white/20 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-xl transition-all duration-300">
          <CardBody className="p-8 flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {step === FORM_STEP.SEARCH
                  ? 'Forgot your password?'
                  : 'Verify your identity'}
              </span>
            </h2>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {step === FORM_STEP.SEARCH
                ? 'Enter your email or phone number to receive an OTP verification code.'
                : `We’ve sent a 6-digit OTP to `}
              {step === FORM_STEP.OTP && (
                <span className="font-medium text-default-700">
                  {userIdentifier}
                </span>
              )}
            </p>

            {step === FORM_STEP.OTP && (
              <Button
                className="mx-auto -mt-2"
                color="primary"
                size="sm"
                variant="light"
                onPress={() => setStep(FORM_STEP.SEARCH)}
              >
                Change email / phone
              </Button>
            )}

            <Form
              className="flex flex-col gap-5"
              onSubmit={formik.handleSubmit}
            >
              {step === FORM_STEP.SEARCH ? (
                <Input
                  errorMessage={
                    formik.touched.username ? formik.errors.username : undefined
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
                <div className="flex flex-col gap-3 w-full items-center justify-center">
                  <InputOtp
                    classNames={{
                      base: 'justify-center mx-auto',
                      segmentWrapper: 'p-0',
                      errorMessage: 'font-bold text-sm text-center',
                    }}
                    containerClassName="w-full items-center justify-center"
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

              <div className="flex justify-end w-full">
                <Button
                  className="font-semibold text-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  color="primary"
                  isLoading={formik.isSubmitting}
                  radius="lg"
                  startContent={
                    <Icon
                      icon={
                        step === FORM_STEP.SEARCH ? 'mdi:magnify' : 'mdi:check'
                      }
                    />
                  }
                  type="submit"
                >
                  {step === FORM_STEP.SEARCH ? 'Search' : 'Verify'}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Loader>
    </motion.div>
  );
};

export default ForgotPasswordForm;
