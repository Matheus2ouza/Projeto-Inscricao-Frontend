import { Payment } from "@/features/inscriptions/types/inscriptionsDetails.types";
import axiosInstance from "@/shared/lib/apiClient";

export type CreatePaymentInscriptionRequest = {
  inscriptionId: string;
  value: number;
  image: string;
};

export async function createPayment(
  body: CreatePaymentInscriptionRequest
): Promise<Payment> {
  const { data } = await axiosInstance.post<Payment>("/payments/create", body);
  return data;
}
