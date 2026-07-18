'use server';

import { listRegionsService } from '@/features/regions/services/listRegions/listRegions';

export async function listRegionsAction() {
  const result = await listRegionsService();
  return result;
}
