import axiosInstance from "@/shared/lib/apiClient";
import type { EventsListResponse } from "../types/listEventsTypes";

export type getEventsForTicketParams = {
  page: number;
  pageSize: number;
};

export async function getEventsForTicket(
  params: getEventsForTicketParams
): Promise<EventsListResponse> {
  const { data } = await axiosInstance.get<EventsListResponse>(
    "/events/tickets",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    }
  );

  return data;
}
