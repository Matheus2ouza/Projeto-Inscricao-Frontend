import axiosInstance from "@/shared/lib/apiClient";

export async function updateStatusTicket(
  eventId: string,
  saleTicketsEnabled: boolean
) {
  try {
    const { data } = await axiosInstance.patch(
      `/events/${eventId}/update/tickets`,
      {
        ticketEnabled: saleTicketsEnabled,
      }
    );
    console.log(data)
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Não foi possível atualizar o status dos tickets."
    );
  }
}
