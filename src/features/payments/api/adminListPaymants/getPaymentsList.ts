import type {
  ListAllPaymentsRequest,
  ListAllPaymentsResponse,
} from '@/features/payments/types/adminListPaymants/listPayments.types';
import { axiosClient } from '@/lib/axios/client';

export async function getPaymentsList(
  request: ListAllPaymentsRequest,
): Promise<ListAllPaymentsResponse> {
  const { eventId, accountId, page, pageSize } = request;

  try {
    const { data } = await axiosClient.get<ListAllPaymentsResponse>(
      `/payments/${eventId}/list`,
      {
        params: {
          ...(accountId ? { accountId } : {}),
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
        'Não foi possível carregar os pagamentos',
    );
  }
}
