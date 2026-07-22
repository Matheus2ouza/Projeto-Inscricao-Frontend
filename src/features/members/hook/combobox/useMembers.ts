'use client';

import {
  useMembersComboboxParms,
  useMembersComboboxResult,
} from '@/features/members/types/membersCombobox/membersComboboxTypes';
import { useMembersQuery } from './useMembersQuery';

export function useMember({
  eventId,
  localityId,
  autoFetch = true,
}: useMembersComboboxParms): useMembersComboboxResult {
  const { data, isLoading, isFetching, error, refetch } = useMembersQuery(
    eventId,
    localityId,
    autoFetch,
  );

  return {
    members: data ?? [],
    loading: isLoading,
    fetching: isFetching,
    error: error
      ? error instanceof Error
        ? error.message
        : 'Falha ao carregar membros'
      : null,
    refetch: async () => {
      await refetch();
    },
  };
}
