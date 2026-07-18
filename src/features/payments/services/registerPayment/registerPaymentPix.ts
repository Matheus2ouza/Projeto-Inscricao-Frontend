'use server';

import type {
  RegisterPaymentPixInput,
  RegisterPaymentPixResponse,
} from '@/features/payments/types/registerPayment/registerPaymentPixTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import FormData from 'form-data';

export async function registerPaymentPixService(
  eventId: string,
  input: RegisterPaymentPixInput,
): Promise<RegisterPaymentPixResponse> {
  try {
    const buffer = Buffer.from(await input.file.arrayBuffer());

    const formData = new FormData();

    // Adiciona o arquivo
    formData.append('file', buffer, {
      filename: input.file.name,
      contentType: input.file.type,
    });

    // Adiciona o restante dos dados no body
    formData.append('inscriptions', input.inscriptionIds.join(','));
    formData.append('name', input.name);
    formData.append('email', input.email);
    formData.append('value', input.value);
    formData.append('date', input.date);

    const response = await axiosServer.post<RegisterPaymentPixResponse>(
      `/payments/${eventId}/register/pix`,
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    return response.data;
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
          'Não foi possível registrar o pagamento PIX no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível registrar o pagamento PIX no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao registrar pagamento PIX: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao registrar o pagamento PIX. Tente novamente mais tarde.',
    );
  }
}
