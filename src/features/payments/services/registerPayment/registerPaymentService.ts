'use server';

import {
  RegisterPaymentInput,
  RegisterPaymentResponse,
} from '@/features/payments/types/registerPayment/registerPaymentTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function registerPaymentService(
  eventId: string,
  input: RegisterPaymentInput,
): Promise<RegisterPaymentResponse> {
  try {
    const { data } = await axiosServer.post<RegisterPaymentResponse>(
      `/payments/${eventId}/register/pix`,
      input,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        throw new Error(message);
      }

      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');
        throw new Error(
          'Não foi possível buscar os pagamentos no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar os pagamentos no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao excluir pagamento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os pagamentos. Tente novamente mais tarde.',
    );
  }
}
