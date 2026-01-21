import axiosInstance from "@/shared/lib/apiClient";
import type { EventsListResponse } from "../types/listEventsTypes";

export type GetEventsForPaymentParams = {
  page: number;
  pageSize: number;
};

export async function getEventsForPayment(
  params: GetEventsForPaymentParams,
): Promise<EventsListResponse> {
  const { data } = await axiosInstance.get<EventsListResponse>(
    "/events/payments",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  );

  return data;
}
