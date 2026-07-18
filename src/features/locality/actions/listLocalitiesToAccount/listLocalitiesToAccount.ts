'use server';

import { listLocalitiesToAccountService } from '../../services/listLocalitiesToAccount/listLocalitiesToAccount';
import { Localities } from '../../types/listLocalitiesToAccount/listLocalitiesToAccount';

export async function listLocalitiesToAccountAction() {
  const result = await listLocalitiesToAccountService();

  const localities: Localities[] = result.map((r) => ({
    id: r.id,
    fullName: `${r.name.toUpperCase()} - ${r.uf}`,
  }));
  return localities;
}
