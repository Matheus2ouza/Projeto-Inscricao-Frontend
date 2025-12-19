"use client";

import { getExpensesByEvent } from "@/features/expenses/api/listExpenses/getExpensesByEvent";
import { expensesKeys } from "@/features/expenses/types/expensesTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UseExpensesByEventParams {
  eventId: string;
  page?: number;
  pageSize?: number;
}

export function useExpensesByEvent({
  eventId,
  page = 1,
  pageSize = 10,
}: UseExpensesByEventParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: expensesKeys.byEventPaginated(eventId, page, pageSize),
    queryFn: async () =>
      await getExpensesByEvent(eventId, {
        page: page.toString(),
        pageSize: pageSize.toString(),
      }),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    invalidate: async () => {
      await queryClient.invalidateQueries({
        queryKey: expensesKeys.byEvent(eventId),
      });
    },
  };
}
