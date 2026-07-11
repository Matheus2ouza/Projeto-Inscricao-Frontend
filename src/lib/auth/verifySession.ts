import { nextAuthOptions } from '@/features/auth/configs/nextAuthOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const verifySession = cache(async () => {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.authToken || session.error === 'RefreshAccessTokenError') {
    redirect('/login');
  }

  return session;
});
