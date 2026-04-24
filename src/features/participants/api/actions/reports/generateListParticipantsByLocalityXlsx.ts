import axiosInstance from '@/shared/lib/apiClient';
import qs from 'qs';

export type GenerateParticipantsByLocalityXlsxParams = {
  eventId: string;
  separate: boolean;
  summary: boolean;
  typeInscriptions?: string | string[];
  columns?: ReportColumnXlsx[];
};

export type ReportColumnXlsx =
  | 'name'
  | 'preferredName'
  | 'cpf'
  | 'birthDate'
  | 'gender'
  | 'shirtSize'
  | 'shirtType'
  | 'typeInscription';

export type GenerateParticipantsByLocalityXlsxResponse = {
  fileBase64: string;
  filename: string;
  contentType:
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'application/zip';
};

export async function generateParticipantsByLocalityXlsx({
  eventId,
  separate = false,
  summary = false,
  typeInscriptions,
  columns,
}: GenerateParticipantsByLocalityXlsxParams): Promise<GenerateParticipantsByLocalityXlsxResponse> {
  try {
    const { data } = await axiosInstance.get(
      `participants/xlsx/${eventId}/locality`,
      {
        params: {
          separate,
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
