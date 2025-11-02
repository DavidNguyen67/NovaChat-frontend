/* eslint-disable prettier/prettier */
'use client';
import React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
};

export default PublicLayout;
