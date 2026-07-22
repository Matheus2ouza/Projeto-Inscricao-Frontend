import { useQuery, useQueryClient } from '@tanstack/react-query';
import { membersComboboxAction } from '../../actions/membersCombobox/membersComboboxActions';
import { membersComboboxResponse } from '../../types/membersCombobox/membersComboboxTypes';

export const membersKeys = {
  all: ['members'] as const,
  combobox: (eventId?: string, localityId?: string) =>
    [...membersKeys.all, 'combobox', eventId, localityId] as const,
};

export function useMembersQuery(
  eventId?: string,
  localityId?: string,
  enabled: boolean = true,
) {
  return useQuery<membersComboboxResponse>({
    queryKey: membersKeys.combobox(eventId, localityId),
    queryFn: () => membersComboboxAction(localityId, eventId),
    enabled: enabled && !!eventId && !!localityId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateMembersQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateCombobox: (eventId?: string, localityId?: string) =>
      queryClient.invalidateQueries({
        queryKey: membersKeys.combobox(eventId, localityId),
      }),
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: membersKeys.all }),
  };
}
