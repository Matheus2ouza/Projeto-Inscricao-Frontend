import { Event } from '@/features/payments/types/registerPaymentPublic/registerPaymentPublicType';
import { axiosClient } from '@/lib/axios/client';

export async function getEvent(eventId: string): Promise<Event> {
  try {
    const { data } = await axiosClient.get<Event>(`/events/${eventId}`);
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível carregar os membros.',
    );
  }
}
