import axiosInstance from "@/shared/lib/apiClient";
import { RegisterPaymentDetailsResponse } from "../../types/registerPaymentDetails/registerPaymentDetails";

export async function registerPaymentDetails(
  inscriptionId: string,
  page: number,
  pageSize: number,
): Promise<RegisterPaymentDetailsResponse> {
  try {
    const { data } = await axiosInstance.get<RegisterPaymentDetailsResponse>(
      `/payments/${inscriptionId}/list/pending/details`,
      {
        params: {
          page,
          pageSize,
        },
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
        "Não foi possível carregar os membros.",
    );
  }
}
