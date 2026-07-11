'use server';

import { listAccountsService } from '@/features/accounts/services/listAccounts/listAccountsService';
import type {
  AccountRole,
  ListAccountsResponse,
} from '@/features/accounts/types/listAccounts/listAccountsTypes';

/**
 * Action: Busca lista de contas com paginação e filtros
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function listAccountsAction(
  roles?: AccountRole[],
): Promise<ListAccountsResponse> {
  const data = await listAccountsService(roles);
  return data;
}
