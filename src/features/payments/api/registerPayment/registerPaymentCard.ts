import { axiosClient } from '@/lib/axios';
import {
  CreatePaymenInscriptionResponse,
  CreatePaymentInscriptiInput,
} from '../../types/registerPayment/registerPaymentCredTypes';

export async function registerPaymentCard(
  input: CreatePaymentInscriptiInput,
): Promise<CreatePaymenInscriptionResponse> {
  try {
    const { data } = await axiosClient.post<CreatePaymenInscriptionResponse>(
      `/payments/${input.eventId}/register/cred`,
      input,
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
