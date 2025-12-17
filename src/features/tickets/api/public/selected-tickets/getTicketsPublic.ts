import { TicketsByEventResponse } from "@/features/tickets/types/analysis/ticketsTypes";

import axiosInstance from "@/shared/lib/apiClient";

export async function getTicketsPublic(
  eventId: string
): Promise<TicketsByEventResponse> {
  try {
    const { data } = await axiosInstance.get<TicketsByEventResponse>(
      `/tickets/public/${eventId}`
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
