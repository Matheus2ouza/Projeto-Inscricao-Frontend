import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import type { EventsListResponse } from "../types/listEventsTypes";

export type GetEventsForPaymentParams = {
  page: number;
  pageSize: number;
  paymentEnabled?: boolean;
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
        paymentEnabled: params.paymentEnabled,
      },
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
    },
  );

  return data;
}
