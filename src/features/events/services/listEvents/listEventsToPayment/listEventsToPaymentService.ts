'use server';

import type {
  ListEventsToPaymentParams,
  ListEventsToPaymentResponse,
} from '@/features/events/types/listEvents/listEventsToPayment/listEventsToPaymentTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import qs from 'qs';

export async function ListEventsToPaymentService(
  params: ListEventsToPaymentParams,
): Promise<ListEventsToPaymentResponse> {
  try {
    const { data } = await axiosServer.get<ListEventsToPaymentResponse>(
      '/events/payments',
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          paymentEnabled: params.paymentEnabled,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
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
          'Não foi possível buscar os pagamentos para inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar os pagamentos para inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar pagamentos para inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os pagamentos para inscrição. Tente novamente mais tarde.',
    );
  }
}
