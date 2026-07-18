import { useQuery, useQueryClient } from '@tanstack/react-query';
import { membersComboboxAction } from '../../actions/membersCombobox/membersComboboxActions';
import { MembersResponse } from '../../types/membersCombobox/membersComboboxTypes';

export const membersKeys = {
  all: ['members'] as const,
  combobox: (eventId?: string, accountId?: string) =>
    [...membersKeys.all, 'combobox', eventId, accountId] as const,
};

export function useMembersQuery(
  eventId?: string,
  localityId?: string,
  enabled: boolean = true,
) {
  return useQuery<MembersResponse>({
    queryKey: membersKeys.combobox(eventId),
    queryFn: () => membersComboboxAction(eventId, localityId),
    enabled: enabled && !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateMembersQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateCombobox: (eventId: string, accountId?: string) =>
      queryClient.invalidateQueries({
        queryKey: membersKeys.combobox(eventId, accountId),
      }),
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: membersKeys.all }),
  };
}
