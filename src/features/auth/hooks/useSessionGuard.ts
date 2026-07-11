'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useSessionGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/login' });
    }
  }, [session]);
}
