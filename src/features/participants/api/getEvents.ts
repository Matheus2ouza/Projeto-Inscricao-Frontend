import axiosInstance from "@/shared/lib/apiClient";
import { FindAllToParticipantsResponse } from "../../events/types/checkout/checkoutTypes";

export async function getEvents(
  page: number,
  pageSize: number
): Promise<FindAllToParticipantsResponse> {
  try {
    const { data } = await axiosInstance.get<FindAllToParticipantsResponse>(
      `/events/participants`,
      {
        params: {
          page,
          pageSize,
        },
      }
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
      "Não foi possível carregar os eventos."
    );
  }
}

