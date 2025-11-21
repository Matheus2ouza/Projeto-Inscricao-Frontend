"use client";

import type { AccountDto } from "../api/getUsersCombobox";
import { useAccountsComboboxQuery } from "./useAccountsQuery";

type UseAccountResult = {
  accounts: AccountDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useAccount(
  autoFetch: boolean = true,
  roles?: string[]
): UseAccountResult {
  const { data, isLoading, isFetching, error, refetch } =
    useAccountsComboboxQuery(autoFetch, roles);

  return {
    accounts: data ?? [],
    loading: isLoading || isFetching,
    error: error
      ? error instanceof Error
        ? error.message
        : "Falha ao carregar contas"
      : null,
    refetch: async () => {
      await refetch();
    },
  };
}
