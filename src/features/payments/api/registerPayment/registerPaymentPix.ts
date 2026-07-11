import { axiosClient } from '@/lib/axios/client';
import {
  RegisterPaymentPixAssasResponse,
  RegisterPaymentPixResponse,
} from '../../types/registerPayment/registerPaymentTypesOld';

export type RegisterPaymentPixRequest = {
  eventId: string;
  guestName: string;
  guestEmail: string;
  isGuest: boolean;
  totalValue: number;
  image: string;
  inscriptions: inscription[];
};

type inscription = {
  id: string;
};

export async function registerPaymentPix(
  body: RegisterPaymentPixRequest,
): Promise<RegisterPaymentPixResponse> {
  try {
    const { data } = await axiosClient.post<RegisterPaymentPixResponse>(
      `/payments/${body.eventId}/register/pix`,
      body,
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
        'Não foi registar o pagamento.',
    );
  }
}

export async function registerPaymentPixAssas(
  inscriptionId: string,
): Promise<RegisterPaymentPixAssasResponse> {
  try {
    const { data } = await axiosClient.post(
      `/payments/${inscriptionId}/register/pix/assas`,
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
        'Não foi registar o pagamento.',
    );
  }
}
