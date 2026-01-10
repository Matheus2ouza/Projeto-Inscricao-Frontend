import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMembersCombobox } from "../../api/combobox/getUsersCombobox";
import { MemberResponse } from "../../types/combobox/membertsComboboxType";

export const membersKeys = {
  all: ["members"] as const,
  lists: () => [...membersKeys.all, "list"] as const,
  combobox: () => [...membersKeys.lists(), "combobox"] as const,
  details: () => [...membersKeys.all, "detail"] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
};

export function useMembersQuery(enabled: boolean = true) {
  return useQuery<MemberResponse[]>({
    queryKey: [...membersKeys.combobox()],
    queryFn: () => getMembersCombobox(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateMembersQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateCombobox: () =>
      queryClient.invalidateQueries({ queryKey: membersKeys.combobox() }),
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: membersKeys.all }),
  };
}
