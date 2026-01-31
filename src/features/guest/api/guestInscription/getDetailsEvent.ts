import { Event } from "@/features/guest/types/guestInscription/guestInscriptionTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getDetailsEvent(eventId: string): Promise<Event> {
  try {
    const { data } = await axiosInstance.get<Event>(
      `/events/${eventId}/details`,
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
        "Não foi possível carregar os membros.",
    );
  }
}
