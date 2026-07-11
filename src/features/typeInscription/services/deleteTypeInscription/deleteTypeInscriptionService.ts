'use server';

import {
  DeleteTypeInscriptionInput,
  DeleteTypeInscriptionResponse,
} from '@/features/typeInscription/types/deleteTypeInscription/deleteTypeInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function deleteTypeInscriptionService({
  id,
}: DeleteTypeInscriptionInput): Promise<DeleteTypeInscriptionResponse> {
  try {
    await axiosServer.delete(`/type-inscription/${id}`);
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
          'Não foi possível deletar o tipo de inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível deletar o tipo de inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao deletar tipo de inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao deletar o tipo de inscrição. Tente novamente mais tarde.',
    );
  }
}
