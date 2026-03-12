import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMembersCombobox } from "../../api/combobox/getUsersCombobox";
import { GetMembersResponse } from "../../types/combobox/membersComboboxType";

export const membersKeys = {
  all: ["members"] as const,
  combobox: (eventId: string, accountId?: string) =>
    [...membersKeys.all, "combobox", eventId, accountId] as const,
};

export function useMembersQuery(
  eventId: string,
  accountId?: string,
  enabled: boolean = true,
) {
  return useQuery<GetMembersResponse>({
    queryKey: membersKeys.combobox(eventId),
    queryFn: () => getMembersCombobox(eventId, accountId),
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
