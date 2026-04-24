import axiosInstance from '@/shared/lib/apiClient';
import qs from 'qs';

export type GenerateParticipantsByLocalityPdfParams = {
  eventId: string;
  separate: boolean;
  reduced: boolean;
  summary: boolean;
  typeInscriptions?: string | string[];
  columns?: ReportColumnPdf[];
};

export type ReportColumnPdf =
  | 'name'
  | 'preferredName'
  | 'cpf'
  | 'birthDate'
  | 'gender'
  | 'shirtSize'
  | 'shirtType'
  | 'typeInscription';

export type GenerateParticipantsByLocalityPdfResponse = {
  fileBase64: string;
  filename: string;
  contentType: 'application/pdf' | 'application/zip';
};

export async function generateParticipantsByLocalityPdf({
  eventId,
  separate = false,
  reduced = false,
  summary = false,
  typeInscriptions,
  columns,
}: GenerateParticipantsByLocalityPdfParams): Promise<GenerateParticipantsByLocalityPdfResponse> {
  try {
    const { data } = await axiosInstance.get(
      `participants/pdf/${eventId}/locality`,
      {
        params: {
          separate,
          reduced,
          summary,
          typeInscriptions: typeInscriptions,
          columns: columns ? columns.join(',') : undefined,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      },
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
        'Não foi possível carregar os participantes',
    );
  }
}
