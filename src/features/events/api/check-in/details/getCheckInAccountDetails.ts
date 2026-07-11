import type { FindAccountsDetailsResponse } from '@/features/events/types/check-in/checkInTypes';
import { axiosClient } from '@/lib/axios/';

type RawPaymentInscription = {
  value: number;
  status: StatusPayment;
  image: string;
  createdAt: string;
};

export enum StatusPayment {
  APPROVED = 'APROVADO',
  UNDER_REVIEW = 'EM ANALISE',
  REFUSED = 'REJEITADO',
}

type RawParticipant = {
  name: string;
  gender: string;
  birthDate: string;
  typeInscription: string;
};

type RawInscription = {
  id: string;
  responsible: string;
  email?: string;
  status: InscriptionStatus;
  totalPayd: number;
  totalDebt: number;
  createdAt: string;
  participants: RawParticipant[];
  paymentInscription: RawPaymentInscription[];
};

export enum InscriptionStatus {
  PENDING = 'PENDENTE',
  UNDER_REVIEW = 'EM ANALISE',
  PAID = 'PAGO',
  CANCELLED = 'CANCELADO',
}

type FindAccountsDetailsApiResponse = Omit<
  FindAccountsDetailsResponse,
  'inscriptions'
> & {
  inscriptions: RawInscription[];
};

const normalizeInscription = (
  inscription: RawInscription,
): FindAccountsDetailsResponse['inscriptions'][number] => ({
  ...inscription,
  createdAt: new Date(inscription.createdAt),
  participants: inscription.participants.map((participant) => ({
    ...participant,
    birthDate: new Date(participant.birthDate),
  })),
  paymentInscription: inscription.paymentInscription.map((payment) => ({
    ...payment,
    createdAt: new Date(payment.createdAt),
  })),
});

export async function getCheckInAccountDetails(
  eventId: string,
  accountId: string,
) {
  try {
    const { data } = await axiosClient.get<FindAccountsDetailsApiResponse>(
      `/events/${eventId}/check-in/accounts/${accountId}/details`,
    );
    const normalizedData: FindAccountsDetailsResponse = {
      ...data,
      inscriptions: data.inscriptions.map(normalizeInscription),
    };
    return normalizedData;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível carregar os detalhes da conta',
    );
  }
}
