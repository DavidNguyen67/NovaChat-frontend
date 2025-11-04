/* eslint-disable prettier/prettier */
'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import { Button, Spinner } from '@heroui/react';

import { ApiError } from '@/interfaces';

interface FallBackProps {
  type?: 'loading' | 'empty' | 'error';
  onRetry?: () => void;
  message?: React.ReactNode;
  error?: ApiError;
}

const FallBack: React.FC<FallBackProps> = ({
  type = 'loading',
  onRetry,
  message,
  error,
}) => {
  const renderContent = () => {
    switch (type) {
      case 'loading':
        return <Spinner color="primary" size="lg" />;

      case 'empty':
        return (
          <>
            <Icon className="text-4xl text-gray-400" icon="mdi:chat-outline" />
            <p className="text-gray-400">{message ?? 'Empty here'}</p>
          </>
        );

      case 'error':
        return (
          <>
            <Icon
              className="text-4xl text-red-500"
              icon="mdi:alert-circle-outline"
            />
            <p className="text-gray-300">
              {error?.message ??
                error?.code ??
                message ??
                'Whoops! Something went wrong.'}
            </p>
            {onRetry && (
              <Button color="primary" size="sm" onPress={onRetry}>
                Try again
              </Button>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
      {renderContent()}
    </div>
  );
};

export default FallBack;
