import { CreateTicketInput, CreateTicketOutput } from "@/features/tickets/types/analysis/ticketsTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function createTicket(
  create: CreateTicketInput
): Promise<CreateTicketOutput> {
  try {
    const { data } = await axiosInstance.post<CreateTicketOutput>(
      "/tickets/create",
      create
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao criar ticket. Tente novamente."
    );
  }
}
