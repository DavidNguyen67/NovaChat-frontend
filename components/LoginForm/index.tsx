/* eslint-disable prettier/prettier */
'use client';

import React, { useRef } from 'react';
import { Input, Button, Card, CardBody, Form } from '@heroui/react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

import Loader from '../Loader';

import { LoginFormValues, loginSchema } from './config';

import { useAccount } from '@/hooks/auth/useAccount';

const LoginForm = () => {
  const { login } = useAccount();
  const router = useRouter();

  const initialValues = useRef<LoginFormValues>({
    username: 'davidnguyen67dev@gmail.com',
    password: '123123',
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
    } catch (error) {}
  };

  const formik = useFormik<LoginFormValues>({
    validationSchema: loginSchema,
    initialValues: initialValues.current,
    onSubmit,
    validateOnBlur: true,
    validateOnChange: true,
  });

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Loader isLoading={formik.isSubmitting}>
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/40 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
          <CardBody className="p-8 flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Welcome back
              </span>
              👋
            </h2>

            <Form
              className="flex flex-col gap-4"
              onSubmit={formik.handleSubmit}
            >
              <Input
                className="backdrop-blur-md"
                errorMessage={
                  formik.touched.username ? formik.errors.username : undefined
                }
                isInvalid={
                  !!(formik.touched.username && formik.errors.username)
                }
                name="username"
                placeholder="Username"
                radius="lg"
                startContent={
                  <Icon
                    className="text-primary text-xl"
                    icon="mdi:account-outline"
                  />
                }
                value={formik.values.username}
                variant="bordered"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />

              <Input
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
                type="password"
                value={formik.values.password}
                variant="bordered"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />

              <Button
                className="w-full font-semibold text-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                color="primary"
                isLoading={formik.isSubmitting}
                radius="lg"
                startContent={<Icon icon="mdi:login" />}
                type="submit"
              >
                Log in
              </Button>
            </Form>

            <div className="text-center">
              <Link
                className="text-sm font-medium text-primary hover:underline"
                href="/forgot-password"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="border-t border-white/10 my-3" />

            <Button
              className="w-full font-semibold text-md shadow-sm bg-white/10 hover:bg-white/20 transition-all duration-300"
              color="secondary"
              radius="lg"
              startContent={
                <Icon className="text-xl" icon="mdi:account-plus-outline" />
              }
              variant="flat"
              onPress={() => router.push('/register')}
            >
              Create new account
            </Button>
          </CardBody>
        </Card>
      </Loader>
    </motion.div>
  );
};

export default LoginForm;
