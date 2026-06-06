import axiosInstance from '@/shared/lib/apiClient';
import qs from 'qs';

export enum InscriptionsStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export type GenerateParticipantsByLocalityXlsxParams = {
  eventId: string;
  separate: boolean;
  summary: boolean;
  typeInscriptions?: string | string[];
  columns?: ReportColumnXlsx[];
  startDate?: string;
  endDate?: string;
  inscriptionsStatus?: InscriptionsStatus[];
};

export type ReportColumnXlsx =
  | 'name'
  | 'preferredName'
  | 'cpf'
  | 'birthDate'
  | 'phone'
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
  startDate,
  endDate,
  inscriptionsStatus,
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
          startDate,
          endDate,
          inscriptionsStatus,
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
