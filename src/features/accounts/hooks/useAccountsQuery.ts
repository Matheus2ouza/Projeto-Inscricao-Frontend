"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccont, type AccountDto } from "../api/getUsersCombobox";

export const accountsKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountsKeys.all, "list"] as const,
  combobox: (rolesKey: string | null = null) =>
    [...accountsKeys.lists(), "combobox", rolesKey] as const,
  details: () => [...accountsKeys.all, "detail"] as const,
  detail: (id: string) => [...accountsKeys.details(), id] as const,
};

export function useAccountsComboboxQuery(
  enabled: boolean = true,
  roles?: string[]
) {
  const rolesKey = roles?.length ? roles.slice().sort().join(",") : null;

  return useQuery<AccountDto[]>({
    queryKey: accountsKeys.combobox(rolesKey),
    queryFn: () => getAccont(roles),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateAccountsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateCombobox: () =>
      queryClient.invalidateQueries({ queryKey: accountsKeys.combobox() }),
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: accountsKeys.all }),
  };
}
