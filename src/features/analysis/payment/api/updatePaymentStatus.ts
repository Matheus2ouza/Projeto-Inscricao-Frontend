import { axiosClient } from '@/lib/axios/client';
import { PaymentStatus, UpdatePaymentResponse } from '../types/analysisTypes';

type UpdatePaymentStatusParams = {
  paymentId: string;
  statusPayment: PaymentStatus;
  rejectionReason?: string;
};

export async function updatePaymentStatus({
  paymentId,
  statusPayment,
  rejectionReason,
}: UpdatePaymentStatusParams): Promise<UpdatePaymentResponse> {
  try {
    const payload: {
      statusPayment: PaymentStatus;
      rejectionReason?: string;
    } = {
      statusPayment,
    };

    if (rejectionReason) {
      payload.rejectionReason = rejectionReason;
    }

    const update = await axiosClient.patch(
      `payments/${paymentId}/update`,
      payload,
    );

    return update?.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ||
        'Erro ao atualizar status do pagamento',
    );
  }
}
