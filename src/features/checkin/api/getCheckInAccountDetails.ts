import axiosInstance from "@/shared/lib/apiClient";
import { CheckInAccountDetailsData } from "../types/checkInTypes";

export async function getCheckInAccountDetails(
  eventId: string,
  accountId: string
) {
  try {
    const { data } = await axiosInstance.get<CheckInAccountDetailsData>(
      `/events/${eventId}/check-in/accounts/${accountId}/details`
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
      "Não foi possível carregar os detalhes da conta"
    );
  }
}
