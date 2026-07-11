import { axiosClient } from '@/lib/axios';
import {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from '../../../types/detailsInscription/actions/modifyReceiptPaymentTypes';

export async function modifyReceiptPayment({
  paymentId,
  image,
}: ModifyReceiptPaymentInput): Promise<ModifyReceiptPaymentResponse> {
  try {
    const { data } = await axiosClient.patch<ModifyReceiptPaymentResponse>(
      `payments/${paymentId}/receipt`,
      { image },
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
