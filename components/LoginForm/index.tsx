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
    username: '',
    password: '',
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
      className="w-[400px] max-w-full"
      initial={{ opacity: 0, y: 20 }}
    >
      <Loader className="w-full h-full" isLoading={formik.isSubmitting}>
        <Card className="shadow-lg rounded-2xl border border-divider bg-content1 backdrop-blur-md transition-colors duration-300">
          <CardBody className="p-8 flex flex-col gap-5">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-primary">
              Welcome back
            </h2>

            <Form
              className="flex flex-col gap-4"
              onSubmit={formik.handleSubmit}
            >
              <Input
                errorMessage={
                  formik.touched.username ? formik.errors.username : undefined
                }
                isInvalid={
                  !!(formik.touched.username && formik.errors.username)
                }
                name="username"
                placeholder="Full name"
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
                className="w-full font-semibold text-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
                color="primary"
                disabled={formik.isSubmitting}
                isLoading={formik.isSubmitting}
                radius="lg"
                type="submit"
              >
                <Icon icon="mdi:login" />
                Log in
              </Button>
            </Form>

            <div className="text-center mt-2">
              <Link
                className="text-primary text-sm font-medium hover:underline"
                href="/forgot-password"
              >
                Forgotten password?
              </Link>
            </div>

            <div className="border-b border-divider my-3" />

            <Button
              className="w-full font-semibold text-md shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
              color="success"
              radius="lg"
              variant="flat"
              onPress={() => router.push('/register')}
            >
              <Icon icon="mdi:account-plus-outline" />
              Create new account
            </Button>
          </CardBody>
        </Card>
      </Loader>
    </motion.div>
  );
};

export default LoginForm;
