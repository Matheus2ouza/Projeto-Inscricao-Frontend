import axiosInstance from "@/shared/lib/apiClient";
import { ListParticipantsResponse } from "../../../events/types/checkout/checkoutTypes";

export async function getParticipants(
  eventId: string,
  page: number,
  pageSize: number,
): Promise<ListParticipantsResponse> {
  try {
    const { data } = await axiosInstance.get<ListParticipantsResponse>(
      `/participants/${eventId}`,
      {
        params: {
          page,
          pageSize,
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
