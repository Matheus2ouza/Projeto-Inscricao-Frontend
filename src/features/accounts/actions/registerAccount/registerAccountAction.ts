'use server';

import {
  RegisterServiceInput,
  RegisterServiceResponse,
} from '@/features/accounts/types/registerAccount/registerAccountTypes';
import { registerAccountService } from '../../services/registerAccount/registerAccountService';

export async function registerAccountAction(
  input: RegisterServiceInput,
): Promise<RegisterServiceResponse> {
  const result = await registerAccountService(input);
  return result;
}
