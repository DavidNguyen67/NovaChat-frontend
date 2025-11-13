/* eslint-disable prettier/prettier */
'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import Profile from '@/components/Profile';

const ProfilePage = () => {
  const { userId } = useParams();

  return <Profile userId={userId as string} />;
};

export default ProfilePage;
