import axiosInstance from "@/shared/lib/apiClient";
import { TicketsByEventResponse } from "../types/ticketsTypes";

export async function getTicketsByEvent(
  eventId: string
): Promise<TicketsByEventResponse> {
  try {
    const { data } = await axiosInstance.get<TicketsByEventResponse>(
      `/ticket/${eventId}`
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar tickets do evento"
    );
  }
}
