import {
  CreatePaymentLinkParams,
  CreatePaymentLinkResponse,
} from "@/features/inscriptions/types/actions/createPaymentLinkTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function createPaymentLink({
  inscriptionId,
}: CreatePaymentLinkParams): Promise<CreatePaymentLinkResponse> {
  try {
    const { data } = await axiosInstance.post<CreatePaymentLinkResponse>(
      `payments/${inscriptionId}/link`,
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
        "Não foi possível buscar os detalhes da inscrição.",
    );
  }
}
