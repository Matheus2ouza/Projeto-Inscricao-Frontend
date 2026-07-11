'use server';

import { DetailsInscriptionResponse } from '@/features/inscriptions/types/myInscriptions/detailsInscription/detailsInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function detailsInscriptionService(
  inscriptionId: string,
): Promise<DetailsInscriptionResponse> {
  try {
    const { data } = await axiosServer.get<DetailsInscriptionResponse>(
      `/inscriptions/${inscriptionId}/details`,
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
          'Não foi possível buscar os detalhes da inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar os detalhes da inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar detalhes da inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os detalhes da inscrição. Tente novamente mais tarde.',
    );
  }
}
