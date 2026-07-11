'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import { ListPaymentsPedingResponse } from '../../types/listPaymentsPeding/listPaymentsPedingTypes';

export async function listPaymentPedingService(
  eventId: string,
  page: number,
  pageSize: number,
): Promise<ListPaymentsPedingResponse> {
  try {
    const { data } = await axiosServer.get<ListPaymentsPedingResponse>(
      `payments/${eventId}/list/pending`,
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
