/* eslint-disable prettier/prettier */
'use client';
import { Spinner } from '@heroui/react';
import React from 'react';

const PreLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center text-default-500 gap-3 m-auto h-full flex-1">
      <Spinner color="primary" size="lg" />
    </div>
  );
};

export default PreLoader;
