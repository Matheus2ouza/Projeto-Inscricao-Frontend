import { CheckInEventInfo } from "@/features/events/types/check-in/checkInTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getCheckInEventInfo(eventId: string) {
  try {
    const { data } = await axiosInstance.get<CheckInEventInfo>(
      `/events/${eventId}/check-in`
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
      "Não foi possível carregar as informações do evento"
    );
  }
}
