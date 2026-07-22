'use server';

import {
  CreateAccountInput,
  CreateAccountResponse,
} from '@/features/accounts/types/createAccount/createAccountTypes';
import { createAccountService } from '../../services/createAccount/registerAccountService';

export async function createAccountAction(
  input: CreateAccountInput,
): Promise<CreateAccountResponse> {
  const result = await createAccountService(input);
  return result;
}
