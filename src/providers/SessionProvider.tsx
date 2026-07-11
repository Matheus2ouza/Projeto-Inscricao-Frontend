'use client';

import { useSessionGuard } from '@/features/auth/hooks';
import { SessionProvider as NextProvider } from 'next-auth/react';
import React from 'react';

function SessionGuard({ children }: { children: React.ReactNode }) {
  useSessionGuard();
  return <>{children}</>;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextProvider refetchInterval={4 * 60}>
      <SessionGuard>{children}</SessionGuard>
    </NextProvider>
  );
}
