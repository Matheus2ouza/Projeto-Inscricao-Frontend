'use server';

import { ListPaymentsResponse } from '@/features/payments/types/listPayments/listPaymentsTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function listPaymentsService(
  eventId: string,
  page: number,
  pageSize: number,
) {
  try {
    const { data } = await axiosServer.get<ListPaymentsResponse>(
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
