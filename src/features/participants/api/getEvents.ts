import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import {
  getEventsResponse,
  StatusEvent,
} from "../types/listEventsForParticipants";

export async function getEvents(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
  guest?: boolean;
}): Promise<getEventsResponse> {
  try {
    const { data } = await axiosInstance.get<getEventsResponse>(
      "/events/participants",
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          status: params.status,
          guest: params.guest,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
      },
    );
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Não foi possível carregar os eventos.",
    );
  }
}
