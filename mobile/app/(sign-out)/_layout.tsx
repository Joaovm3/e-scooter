import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(sign-in)/(home)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
