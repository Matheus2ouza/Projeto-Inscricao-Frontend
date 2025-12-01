import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import { FindAllWithPaymentsOutput } from "../types/eventsForPayments.types";

export async function getEventsWithPayments(params: {
  page: number;
  pageSize: number;
  status?: string[];
}): Promise<FindAllWithPaymentsOutput> {
  const { data } = await axiosInstance.get<FindAllWithPaymentsOutput>(
    "/events/payments",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        status: params.status,
      },
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
    }
  );

  return data;
}
