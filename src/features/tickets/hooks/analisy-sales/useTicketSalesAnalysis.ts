"use client";

import { getTicketSalesAnalysis } from "@/features/tickets/api/analisy-sales/getTicketSalesAnalysis";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const ticketSalesAnalysisKeys = {
  all: ["ticket-sales-analysis"] as const,
  event: (eventId: string, page: number, pageSize: number) =>
    [
      ...ticketSalesAnalysisKeys.all,
      "event",
      eventId,
      { page, pageSize },
    ] as const,
};

type UseTicketSalesAnalysisOptions = {
  initialPage?: number;
  pageSize?: number;
};

export function useTicketSalesAnalysis(
  eventId: string,
  options?: UseTicketSalesAnalysisOptions
) {
  const { initialPage = 1, pageSize = 10 } = options ?? {};
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [eventId, initialPage]);

  const query = useQuery({
    queryKey: ticketSalesAnalysisKeys.event(eventId, page, pageSize),
    queryFn: () => getTicketSalesAnalysis(eventId, { page, pageSize }),
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
    analysis: query.data ?? null,
    event: query.data?.event ?? null,
    ticketSales: query.data?.event?.TicketSales ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    pageCount: query.data?.pageCount ?? 1,
    pageSize,
    setPage: setSafePage,
  };
}
