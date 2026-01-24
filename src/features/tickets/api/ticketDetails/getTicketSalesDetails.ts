import { mapTicketDetails } from "@/features/tickets/mappers/ticketDetails.mapper";
import type {
  FindTicketDetailsResponse,
  TicketDetails,
} from "@/features/tickets/types/ticketDetails/ticketDetailsTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getTicketSalesDetails(
  ticketId: string,
): Promise<TicketDetails> {
  try {
    const { data } = await axiosInstance.get<FindTicketDetailsResponse>(
      `/tickets/${ticketId}/details`,
    );

    return mapTicketDetails(data);
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar detalhes de vendas do ticket",
    );
  }
}
