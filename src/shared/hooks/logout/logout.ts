'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/web-api/logout', { method: 'POST' });
    } catch {
    } finally {
      setLoading(false);
    }

    router.push('/login');
  };

  return {
    logout: handleLogout,
  };
}
