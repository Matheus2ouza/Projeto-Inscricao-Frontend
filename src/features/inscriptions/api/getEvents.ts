import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import { getAllEventsResponse } from "../../events/types/selectEvent";
import type { StatusEvent } from "../types/selectEvent";

export async function getEventsToAnalysis(params: {
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
