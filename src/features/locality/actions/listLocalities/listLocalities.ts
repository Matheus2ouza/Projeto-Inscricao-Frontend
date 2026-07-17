'use server';

import { listLocalitiesService } from '../../services/listLocalities/listLocalities';
import { Localities } from '../../types/listLocalities/listLocalitiesTypes';

export async function listLocalitiesAction(eventId?: string) {
  const result = await listLocalitiesService(eventId);

  const localities: Localities[] = result.map((r) => ({
    id: r.id,
    fullName: `${r.name.toUpperCase()} - ${r.uf}`,
  }));
  return localities;
}
