import { ListPaymentsResponse } from '@/features/payments/types/listPayment/listPaymentTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function getListPayments(
  eventId: string,
  page: number,
  pageSize: number,
): Promise<ListPaymentsResponse> {
  try {
    const { data } = await axiosInstance.get<ListPaymentsResponse>(
      `payments/${eventId}/list`,
      {
        params: {
          page,
          pageSize,
        },
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
        'Não foi possível carregar os membros.',
    );
  }
}
