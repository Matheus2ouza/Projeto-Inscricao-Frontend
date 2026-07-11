'use server';

import {
  IndividualInscriptionInput,
  IndividualInscriptionResponse,
} from '@/features/inscriptions/types/individualInscription/registerIndividualInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function registerIndividualInscriptionService(
  data: IndividualInscriptionInput,
): Promise<IndividualInscriptionResponse> {
  try {
    const { data: response } =
      await axiosServer.post<IndividualInscriptionResponse>(
        '/inscription/indiv/register',
        data,
      );
    return response;
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
          'Não foi possível realizar a inscrição individual no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível realizar a inscrição individual no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao realizar inscrição individual: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao realizar a inscrição individual. Tente novamente mais tarde.',
    );
  }
}
