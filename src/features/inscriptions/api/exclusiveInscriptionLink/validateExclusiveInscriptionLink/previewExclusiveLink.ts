import { PreviewExclusiveInscriptionLinkResponse } from '@/features/inscriptions/types/exclusiveInscriptionLink/validateExclusiveInscriptionLink/validateExclusiveInscriptionLinkTypes';
import { axiosClient } from '@/lib/axios/client';

export async function previewExclusiveLink(
  token: string,
): Promise<PreviewExclusiveInscriptionLinkResponse> {
  try {
    const { data } = await axiosClient.get(
      `exclusive-inscription/${token}/preview`,
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
        'Não foi possível os dados de preview.',
    );
  }
}
