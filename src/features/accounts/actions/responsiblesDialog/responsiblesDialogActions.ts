'use server';

import { responsiblesDialogService } from '@/features/accounts/services/responsiblesDialog/responsiblesDialogService';
import type {
  AccountRole,
  ResponsiblesDialogResponse,
} from '@/features/accounts/types/responsiblesDialog/responsiblesDialogTypes';

/**
 * Action: Busca contas para o diálogo de responsáveis
 * Passa os dados adiante sem normalização (já vem tipado do service)
 */
export async function responsiblesDialogAction(
  roles?: AccountRole[],
): Promise<ResponsiblesDialogResponse> {
  const data = await responsiblesDialogService(roles);
  return data;
}
