/* eslint-disable prettier/prettier */
'use client';

import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

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
            className="text-6xl text-blue-500"
            icon="mdi:map-marker-off-outline"
          />
        </div>

        <h2 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          404 – Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="w-full sm:w-auto"
            startContent={<Icon icon="mdi:arrow-left" />}
            variant="flat"
            onPress={() => router.back()}
          >
            Go Back
          </Button>
          <Button
            className="w-full sm:w-auto"
            color="primary"
            startContent={<Icon icon="mdi:home-outline" />}
            onPress={() => router.push('/')}
          >
            Go Home
          </Button>
        </div>
      </motion.div>

      <motion.p
        animate={{ opacity: 1 }}
        className="mt-8 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        Looks like you’re lost in space 🪐
      </motion.p>
    </div>
  );
};

export default NotFoundPage;
