import React from 'react';

import type { User } from '@/features/auth/types/loginTypes';
import { verifySession } from '@/lib/auth';
import { UserContextProvider } from '../context/user-context';

type SessionUserProviderProps = {
  children: React.ReactNode;
};

export default async function SessionUserProvider({
  children,
}: SessionUserProviderProps) {
  const session = await verifySession();
  const user = session.user as User;

  if (!session?.user) {
    throw new Error('SessionUserProvider requires authenticated session');
  }

  return (
    <UserContextProvider initialUser={user}>{children}</UserContextProvider>
  );
}
