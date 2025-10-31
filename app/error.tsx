'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-6">
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/10 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex justify-center mb-4">
          <Icon
            className="text-6xl text-red-500"
            icon="mdi:alert-circle-outline"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          An unexpected error occurred. You can try again or go back to the
          previous page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="w-full sm:w-auto"
            color="primary"
            startContent={<Icon icon="mdi:refresh" />}
            onPress={() => reset()}
          >
            Try again
          </Button>
          <Button
            className="w-full sm:w-auto"
            startContent={<Icon icon="mdi:home-outline" />}
            variant="flat"
            onPress={() => (window.location.href = '/')}
          >
            Go home
          </Button>
        </div>
      </motion.div>

      <motion.p
        animate={{ opacity: 1 }}
        className="mt-8 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        Error details: <span className="italic">{error.message}</span>
      </motion.p>
    </div>
  );
};

export default ErrorPage;
