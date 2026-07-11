import { axiosClient } from '@/lib/axios';

export async function updateStatusTicket(
  eventId: string,
  saleTicketsEnabled: boolean,
) {
  try {
    const { data } = await axiosClient.patch(
      `/events/${eventId}/update/tickets`,
      {
        saleTicketsStatus: saleTicketsEnabled,
      },
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
        'Não foi possível atualizar o status dos tickets.',
    );
  }
}
