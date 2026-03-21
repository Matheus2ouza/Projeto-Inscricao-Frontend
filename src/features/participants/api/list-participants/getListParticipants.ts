import axiosInstance from "@/shared/lib/apiClient";
import { GetListParticipantsResponse } from "../../types/list-participants/listParticipantsTypes";

export async function getListParticipants(
  eventId: string,
  param: {
    page: number;
    pageSize: number;
  },
): Promise<GetListParticipantsResponse> {
  try {
    const { data } = await axiosInstance.get<GetListParticipantsResponse>(
      `/participants/${eventId}`,
      {
        params: {
          page: param.page,
          pageSize: param.pageSize,
        },
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
        "Não foi possível carregar os participantes",
    );
  }
}
