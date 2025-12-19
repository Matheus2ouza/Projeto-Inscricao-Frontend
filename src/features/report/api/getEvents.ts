import type { StatusEvent } from "@/features/report/types/selectEvent";
import { getAllEventsResponse } from "@/features/report/types/selectEvent";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export async function getEvents(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
}): Promise<getAllEventsResponse> {
  const { data } = await axiosInstance.get<getAllEventsResponse>(
    "/events/inscriptions",
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
