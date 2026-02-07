import axiosInstance from "@/shared/lib/apiClient";
import { GuestParticipantsResponse } from "../../types/list-guest-participants/guestParticipantsTypes";

export async function getGuestParticipants(
  eventId: string,
  param: {
    page: number;
    pageSize: number;
  },
): Promise<GuestParticipantsResponse> {
  try {
    const { data } = await axiosInstance.get<GuestParticipantsResponse>(
      `/participants/${eventId}/guests`,
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
