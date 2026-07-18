'use server';

import {
  IndividualInscriptionActionResult,
  IndividualInscriptionInput,
  IndividualInscriptionResponse,
} from '@/features/inscriptions/types/individualInscription/registerIndividualInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function registerIndividualInscriptionService(
  data: IndividualInscriptionInput,
): Promise<IndividualInscriptionActionResult> {
  try {
    const { data: response } =
      await axiosServer.post<IndividualInscriptionResponse>(
        '/inscription/indiv/register',
        data,
      );
    return { success: true, data: response };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message, incompleteMembers } = error
          .response.data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        return { success: false, message, incompleteMembers };
      }

      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');
        return {
          success: false,
          message:
            'Não foi possível realizar a inscrição em grupo no momento. Tente novamente mais tarde.',
        };
      }

      console.error(error.message);
      return {
        success: false,
        message:
          'Não foi possível realizar a inscrição em grupo no momento. Tente novamente mais tarde.',
      };
    }

    console.error(`Erro ao realizar inscrição em grupo: ${error}`);
    return {
      success: false,
      message:
        'Ocorreu um erro inesperado ao realizar a inscrição em grupo. Tente novamente mais tarde.',
    };
  }
}
