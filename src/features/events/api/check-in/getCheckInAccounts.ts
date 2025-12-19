import { AccountsPaginatedResponse } from "@/features/events/types/check-in/checkInTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getCheckInAccounts(
  eventId: string,
  page: number,
  pageSize: number,
  onlyWithDebt?: boolean
) {
  try {
    const { data } = await axiosInstance.get<AccountsPaginatedResponse>(
      `/events/${eventId}/check-in/accounts`,
      {
        params: {
          page,
          pageSize,
          withDebt: onlyWithDebt,
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
