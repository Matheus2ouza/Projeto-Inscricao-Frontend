'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function deleteInscriptionService(paymentId: string) {
  try {
    const { data } = await axiosServer.delete(`/inscriptions/${paymentId}`);
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
          'Não foi possível excluir a inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível excluir a inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao excluir pagamento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao excluir a inscrição. Tente novamente mais tarde.',
    );
  }
}
