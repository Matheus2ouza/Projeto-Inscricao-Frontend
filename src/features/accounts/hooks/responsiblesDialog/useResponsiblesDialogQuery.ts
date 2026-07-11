'use client';

import { responsiblesDialogAction } from '@/features/accounts/actions/responsiblesDialog/responsiblesDialogActions';
import type {
  AccountRole,
  ResponsiblesDialogResponse,
} from '@/features/accounts/types/responsiblesDialog/responsiblesDialogTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const responsiblesDialogKeys = {
  all: ['responsibles-dialog'] as const,
  lists: () => [...responsiblesDialogKeys.all, 'list'] as const,
  combobox: () => [...responsiblesDialogKeys.lists(), 'combobox'] as const,
  details: () => [...responsiblesDialogKeys.all, 'detail'] as const,
  detail: (id: string) => [...responsiblesDialogKeys.details(), id] as const,
};

export function useResponsiblesDialogQuery(
  enabled: boolean = true,
  roles?: AccountRole[],
) {
  return useQuery<ResponsiblesDialogResponse>({
    queryKey: [...responsiblesDialogKeys.combobox(), { roles }],
    queryFn: () => responsiblesDialogAction(roles),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateResponsiblesDialogQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateCombobox: () =>
      queryClient.invalidateQueries({
        queryKey: responsiblesDialogKeys.combobox(),
      }),
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: responsiblesDialogKeys.all }),
    invalidateLists: () =>
      queryClient.invalidateQueries({
        queryKey: responsiblesDialogKeys.lists(),
      }),
  };
}
