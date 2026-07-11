import {
  RegisterPaymentInput,
  RegisterPaymentResponse,
} from '@/features/payments/types/adminRegisterPayment/registerPaymentType';
import { axiosClient } from '@/lib/axios/client';

export async function registerPayment(
  body: RegisterPaymentInput,
): Promise<RegisterPaymentResponse> {
  try {
    const { data } = await axiosClient.post<RegisterPaymentResponse>(
      `payments/register/admin`,
      body,
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
        'Não foi possível carregar as inscrições pendentes.',
    );
  }
}
