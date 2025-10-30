/* eslint-disable prettier/prettier */
import React from 'react';
import { Spinner, SpinnerProps } from '@heroui/react';
import clsx from 'clsx';

interface LoaderProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  overlayClassName?: string;
  spinnerProps?: SpinnerProps;
  className?: string;
}

const Loader = ({
  isLoading,
  children,
  overlayClassName,
  spinnerProps,
  className,
}: LoaderProps) => {
  return (
    <div className={clsx('relative', className)}>
      {children}

      {isLoading && (
        <div
          className={clsx(
            'absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl transition-all',
            overlayClassName,
          )}
        >
          <Spinner color="white" {...spinnerProps} />
        </div>
      )}
    </div>
  );
};

export default Loader;
