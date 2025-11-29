import axiosInstance from "@/shared/lib/apiClient";
import { TicketDetails } from "../types/ticketsTypes";

export async function getTicketSalesDetails(
  ticketId: string
): Promise<TicketDetails> {
  try {
    const { data } = await axiosInstance.get<TicketDetails>(
      `/tickets/${ticketId}/details`
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao carregar detalhes de vendas do ticket"
    );
  }
}
