import { axiosClient } from '@/lib/axios';

export type GenerateSelectedInscriptionsPdfResponse = {
  data?: {
    pdfBase64?: string;
    filename?: string;
    message?: string;
  };
  pdfBase64?: string;
  filename?: string;
  message?: string;
};

export type GenerateSelectedInscriptionsPdfInput = {
  eventId: string;
  inscriptionIds: string[];
};

export async function generateSelectedInscriptionsPdf({
  eventId,
  inscriptionIds,
}: GenerateSelectedInscriptionsPdfInput) {
  try {
    const { data } =
      await axiosClient.post<GenerateSelectedInscriptionsPdfResponse>(
        `/events/pdf/${eventId}/list-inscription`,
        {
          inscriptionIds,
        },
      );

    return data;
  } catch (error) {
    console.error('Error while trying to generate the report: ', error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message || 'Falha ao tentar gerar o PDF',
    );
  }
}
