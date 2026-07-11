'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import SuperHomeDashboard from '@/features/home/components/super/SuperHomeDashboard';

export default function SuperHomePage() {
  const { setLoading } = useGlobalLoading();

  return <SuperHomeDashboard />;
}
