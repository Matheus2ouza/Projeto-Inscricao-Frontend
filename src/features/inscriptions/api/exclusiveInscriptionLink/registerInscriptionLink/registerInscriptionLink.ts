import {
  RegisterInscriptionLinkInput,
  RegisterInscriptionLinkResponse,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLinkTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function registerInscriptionLink(
  payload: RegisterInscriptionLinkInput,
): Promise<RegisterInscriptionLinkResponse> {
  try {
    const { data } = await axiosInstance.post(
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
