import {
  RegisterPaymentInput,
  RegisterPaymentResponse,
} from '@/features/payments/types/adminRegisterPayment/registerPaymentType';
import axiosInstance from '@/shared/lib/apiClient';

export async function registerPayment(
  body: RegisterPaymentInput,
): Promise<RegisterPaymentResponse> {
  try {
    const { data } = await axiosInstance.post<RegisterPaymentResponse>(
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
