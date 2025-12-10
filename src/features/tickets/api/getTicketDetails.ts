import { FindTicketDetailsResponse } from "@/features/tickets/types/ticketSaleRegisterTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getTicketDetails(
  ticketId: string
): Promise<FindTicketDetailsResponse> {
  try {
    const { data } = await axiosInstance.get<FindTicketDetailsResponse>(
      `/tickets/${ticketId}/details`
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
      "Não foi possível carregar os detalhes do ticket"
    );
  }
}
