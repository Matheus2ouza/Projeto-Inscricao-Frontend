import axiosInstance from "@/shared/lib/apiClient";
import { CreatePaymentResponse } from "../../types/registerPayment/registerPaymentTypes";

export type CreatePaymentInscriptionRequest = {
  eventId: string;
  totalValue: number;
  image: string;
  inscriptions: inscription[];
};

type inscription = {
  id: string;
};

export async function registerPayment(
  body: CreatePaymentInscriptionRequest,
): Promise<CreatePaymentResponse> {
  const { data } = await axiosInstance.post<CreatePaymentResponse>(
    "/payments/register",
    body,
  );
  return data;
}
