'use server';

import { membersComboboxService } from '@/features/members/services/membersCombobox/membersComboboxService';
import type { MembersResponse } from '@/features/members/types/membersCombobox/membersComboboxTypes';

/**
 * Action: Busca membros para combobox
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function membersComboboxAction(
  eventId: string,
  accountId?: string,
): Promise<MembersResponse> {
  const data = await membersComboboxService(eventId, accountId);

  // O service já retorna o objeto tipado ou lança erro com mensagem
  // Se precisar de normalização adicional, faça aqui

  return data;
}
