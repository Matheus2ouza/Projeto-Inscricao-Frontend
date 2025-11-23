import axiosInstance from "@/shared/lib/apiClient";
import { CreateTicketInput, CreateTicketOutput } from "../types/ticketsTypes";

export async function createTicket(
  input: CreateTicketInput
): Promise<CreateTicketOutput> {
  try {
    const { data } = await axiosInstance.post<CreateTicketOutput>(
      "/ticket/create",
      input
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
