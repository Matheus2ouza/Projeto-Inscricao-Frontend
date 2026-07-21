'use server';

import { listAccountsComboboxService } from '@/features/accounts/services/listAccountsCombobox/listAccountsComboboxService';
import type {
  AccountRole,
  ListAccountsResponse,
} from '@/features/accounts/types/listAccountsCombobox/listAccountsComboboxTypes';

/**
 * Action: Busca lista de contas com paginação e filtros
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function listAccountsComboboxAction(
  roles?: AccountRole[],
): Promise<ListAccountsResponse> {
  const data = await listAccountsComboboxService(roles);
  return data;
}
