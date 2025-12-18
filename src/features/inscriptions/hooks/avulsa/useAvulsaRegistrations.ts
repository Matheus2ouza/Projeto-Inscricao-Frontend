"use client";

import { useQuery } from "@tanstack/react-query";
import { getAvulsaRegistrations } from "../../api/avulsa/getAvulsaRegistrations";
import { avulsaKeys } from "../../types/avulsa/avulsaTypes";

export function useAvulsaRegistrations(
  eventId: string,
  page: number,
  pageSize: number
) {
  const query = useQuery({
    queryKey: avulsaKeys.list(eventId, page, pageSize),
    queryFn: async () =>
      await getAvulsaRegistrations({
        eventId,
        page: String(page),
        pageSize: String(pageSize),
      }),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return query;
}
