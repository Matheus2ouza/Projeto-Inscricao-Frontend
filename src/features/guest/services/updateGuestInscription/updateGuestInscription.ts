'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import {
  UpdateGuestInscriptionInput,
  UpdateGuestInscriptionResponse,
} from '../../types/updateGuestInscription/updateGuestInscriptionTypes';

export async function updateGuestInscriptionService(
  id: string,
  input: UpdateGuestInscriptionInput,
): Promise<UpdateGuestInscriptionResponse> {
  try {
    const { data } = await axiosServer.put<UpdateGuestInscriptionResponse>(
      `inscriptions/${id}`,
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
          'Não foi possível registrar a inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível registrar a inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar detalhes do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao registrar a inscrição. Tente novamente mais tarde.',
    );
  }
}
