"use client";

import { MemberResponse } from "@/features/members/types/combobox/membertsComboboxType";
import { useMembersQuery } from "./useMembersQuery";

type UseMemberResult = {
  members: MemberResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useMember(
  eventId: string,
  autoFetch: boolean = true,
): UseMemberResult {
  const { data, isLoading, isFetching, error, refetch } = useMembersQuery(
    eventId,
    autoFetch,
  );

  return {
    members: data ?? [],
    loading: isLoading || isFetching,
    error: error
      ? error instanceof Error
        ? error.message
        : "Falha ao carregar membros"
      : null,
    refetch: async () => {
      await refetch();
    },
  };
}
