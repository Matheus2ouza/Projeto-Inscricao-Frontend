import { axiosClient } from '@/lib/axios/client';
import qs from 'qs';

export enum InscriptionsStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export type GenerateParticipantsByLocalityPdfParams = {
  eventId: string;
  separate: boolean;
  reduced: boolean;
  summary: boolean;
  typeInscriptions?: string | string[];
  columns?: ReportColumnPdf[];
  startDate?: string;
  endDate?: string;
  inscriptionsStatus?: InscriptionsStatus[];
};

export type ReportColumnPdf =
  | 'name'
  | 'preferredName'
  | 'cpf'
  | 'birthDate'
  | 'phone'
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
  startDate,
  endDate,
  inscriptionsStatus,
}: GenerateParticipantsByLocalityPdfParams): Promise<GenerateParticipantsByLocalityPdfResponse> {
  try {
    const { data } = await axiosClient.get(
      `participants/pdf/${eventId}/locality`,
      {
        params: {
          separate,
          reduced,
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
