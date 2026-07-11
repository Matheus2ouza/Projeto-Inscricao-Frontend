'use client';

import type {
  AccountRole,
  UseResponsiblesDialogResult,
} from '@/features/accounts/types/responsiblesDialog/responsiblesDialogTypes';
import { useResponsiblesDialogQuery } from './useResponsiblesDialogQuery';

export function useResponsiblesDialog(
  autoFetch: boolean = true,
  roles?: AccountRole[],
): UseResponsiblesDialogResult {
  const { data, isLoading, isFetching, error, refetch } =
    useResponsiblesDialogQuery(autoFetch, roles);

  return {
    accounts: data ?? [],
    loading: isLoading || isFetching,
    error: error
      ? error instanceof Error
        ? error.message
        : 'Falha ao carregar contas'
      : null,
    refetch: async () => {
      await refetch();
    },
  };
}
