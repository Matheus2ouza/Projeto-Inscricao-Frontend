'use server';

import { listLocalitiesService } from '../../services/listLocalities/listLocalities';
import { Localities } from '../../types/listLocalities/listLocalitiesTypes';

export async function listLocalitiesAction() {
  const result = await listLocalitiesService();

  const localities: Localities[] = result.map((r) => ({
    id: r.id,
    fullName: `${r.name.toUpperCase()} - ${r.uf}`,
  }));
  return localities;
}
