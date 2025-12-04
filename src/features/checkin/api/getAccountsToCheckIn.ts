import axiosInstance from "@/shared/lib/apiClient";
import { FindAccountsToCheckInResponse } from "../types/checkInTypes";

export async function getAccountsToCheckIn(
  eventId: string,
  page: number,
  pageSize: number
): Promise<FindAccountsToCheckInResponse> {
  try {
    const { data } = await axiosInstance.get<FindAccountsToCheckInResponse>(
      `/events/${eventId}/check-in`,
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
      "Não foi possível carregar as contas para check-in"
    );
  }
}
