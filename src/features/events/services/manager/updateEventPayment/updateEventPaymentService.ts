'use server';

import type {
  UpdateEventPaymentInput,
  UpdateEventPaymentResponse,
} from '@/features/events/types/manager/updateEventPayment/updateEventPaymentTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateEventPaymentService(
  input: UpdateEventPaymentInput,
): Promise<UpdateEventPaymentResponse> {
  try {
    const { data } = await axiosServer.patch<UpdateEventPaymentResponse>(
      `/events/${input.eventId}/update/payments`,
      { status: input.paymentEnabled },
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
          'Não foi possível atualizar o status de pagamento no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar o status de pagamento no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar status de pagamento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar o status de pagamento. Tente novamente mais tarde.',
    );
  }
}
