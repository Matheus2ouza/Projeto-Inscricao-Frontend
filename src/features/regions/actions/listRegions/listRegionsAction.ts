'use server';

import { listRegionsService } from '@/features/regions/services/listRegions/listRegions';
import { ListRegionsResponse } from '@/features/regions/types/listRegions/listRegionsTypes';

export async function listRegionsAction(): Promise<ListRegionsResponse> {
  const result = await listRegionsService();
  return result;
}
