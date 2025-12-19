import type { StatusEvent } from "@/features/events/types/check-in/selectEvent";
import { getAllEventsResponse } from "@/features/events/types/check-in/selectEvent";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export async function getEvents(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
}): Promise<getAllEventsResponse> {
  const { data } = await axiosInstance.get<getAllEventsResponse>(
    "/events/accounts",
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
