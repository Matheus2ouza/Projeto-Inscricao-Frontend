'use server';

import { ListAccountsResponse } from '@/features/accounts/types/listAccounts/listAccountsTypes';
import { listAccountsService } from '../../services/listAccounts/listAccountsService';

export async function listAccountsAction(
  page: number,
  pageSize: number,
): Promise<ListAccountsResponse> {
  return listAccountsService(page, pageSize);
}
