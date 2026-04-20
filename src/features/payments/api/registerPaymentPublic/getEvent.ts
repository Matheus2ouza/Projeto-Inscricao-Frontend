import { Event } from '@/features/payments/types/registerPaymentPublic/registerPaymentPublicType';
import axiosInstance from '@/shared/lib/apiClient';

export async function getEvent(eventId: string): Promise<Event> {
  try {
    const { data } = await axiosInstance.get<Event>(`/events/${eventId}`);
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
