import {
  RegisterInscriptionLinkInput,
  RegisterInscriptionLinkResponse,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLinkTypes';
import { axiosClient } from '@/lib/axios/client';

export async function registerInscriptionLink(
  payload: RegisterInscriptionLinkInput,
): Promise<RegisterInscriptionLinkResponse> {
  try {
    const { data } = await axiosClient.post(
      'inscription/exclusive/register',
      payload,
    );
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível realizar a inscrição.',
    );
  }
}
