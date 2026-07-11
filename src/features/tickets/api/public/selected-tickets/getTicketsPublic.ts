import { TicketsByEventResponse } from '@/features/tickets/types/analysis/ticketsTypes';

import { axiosClient } from '@/lib/axios';

export async function getTicketsPublic(
  eventId: string,
): Promise<TicketsByEventResponse> {
  try {
    const { data } = await axiosClient.get<TicketsByEventResponse>(
      `/tickets/public/${eventId}`,
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        'Falha ao carregar tickets do evento',
    );
  }
}
