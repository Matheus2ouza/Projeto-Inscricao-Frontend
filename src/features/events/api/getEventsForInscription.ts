import axiosInstance from "@/shared/lib/apiClient";
import type { EventsListResponse } from "../types/listEventsTypes";

export type GetEventsForInscriptionParams = {
  page: number;
  pageSize: number;
};

export async function getEventsForInscription(
  params: GetEventsForInscriptionParams
): Promise<EventsListResponse> {
  const { data } = await axiosInstance.get<EventsListResponse>(
    "/events/inscriptions",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    }
  );

  return data;
}
