'use server';

import { membersComboboxService } from '@/features/members/services/membersCombobox/membersComboboxService';
import type { membersComboboxResponse } from '@/features/members/types/membersCombobox/membersComboboxTypes';

/**
 * Action: Busca membros para combobox
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function membersComboboxAction(
  localityId?: string,
  eventId?: string,
): Promise<membersComboboxResponse> {
  const data = await membersComboboxService(localityId, eventId);

  // O service já retorna o objeto tipado ou lança erro com mensagem
  // Se precisar de normalização adicional, faça aqui

  return data;
}
