"use client";

import { getListPreSales } from "@/features/tickets/api/list-sales/getListPreSales";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const listPreSalesKeys = {
  all: ["ticket-pre-sales-list"] as const,
  event: (eventId: string, page: number, pageSize: number) =>
    [...listPreSalesKeys.all, eventId, { page, pageSize }] as const,
};

type UseListPreSalesOptions = {
  initialPage?: number;
  pageSize?: number;
};

export function useListPreSales(
  eventId: string,
  options?: UseListPreSalesOptions
) {
  const { initialPage = 1, pageSize = 10 } = options ?? {};
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [eventId, initialPage]);

  const query = useQuery({
    queryKey: listPreSalesKeys.event(eventId, page, pageSize),
    queryFn: () => getListPreSales(eventId, { page, pageSize }),
    enabled: Boolean(eventId),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const setSafePage = (nextPage: number) => {
    setPage((current) => {
      if (!Number.isFinite(nextPage) || Number.isNaN(nextPage)) {
        return current;
      }

      const safePage = Math.max(1, Math.floor(nextPage));
      const limit = query.data?.pageCount;

      if (limit && safePage > limit) {
        return limit;
      }

      return safePage;
    });
  };

  return {
    ...query,
    sales: query.data?.event?.ticketSales ?? [],
    event: query.data?.event ?? null,
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    pageCount: query.data?.pageCount ?? 1,
    pageSize,
    setPage: setSafePage,
  };
}
