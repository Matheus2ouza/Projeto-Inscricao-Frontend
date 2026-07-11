'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import { FindPaymentsDateResponse } from '../../types/admin/paymentsDatesTypes';

export async function paymentsDatesService(): Promise<FindPaymentsDateResponse> {
  try {
    const { data } =
      await axiosServer.get<FindPaymentsDateResponse>('/payments/dates');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        return [];
      }

      // A requisição foi enviada, mas o servidor não respondeu
      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');

        return [];
      }

      // Erro ao configurar a requisição
      console.error(error.message);

      return [];
    }

    console.error(`Error ao realizar login do user: ${error}`);

    return [];
  }
}
