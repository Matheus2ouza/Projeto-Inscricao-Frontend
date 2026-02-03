import axiosInstance from "@/shared/lib/apiClient";
import { CreatePaymentGuestResponse } from "../../types/registerPayment/registerPaymentTypes";

export type CreatePaymentGuestInscriptionRequest = {
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

export async function guestRegisterPayment(
  body: CreatePaymentGuestInscriptionRequest,
): Promise<CreatePaymentGuestResponse> {
  const { data } = await axiosInstance.post<CreatePaymentGuestResponse>(
    `/payments/${body.eventId}/register/pix`,
    body,
  );
  return data;
}
