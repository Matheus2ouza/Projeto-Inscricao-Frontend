'use server';

import type {
  CreateTypeInscriptionInput,
  CreateTypeInscriptionResponse,
} from '@/features/typeInscription/types/createTypeInscription/createTypeInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function createTypeInscriptionService(
  input: CreateTypeInscriptionInput,
): Promise<CreateTypeInscriptionResponse> {
  try {
    const { data } = await axiosServer.post<CreateTypeInscriptionResponse>(
      `/type-inscription/${input.eventId}/create`,
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
          'Não foi possível criar o tipo de inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível criar o tipo de inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao criar tipo de inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao criar o tipo de inscrição. Tente novamente mais tarde.',
    );
  }
}
