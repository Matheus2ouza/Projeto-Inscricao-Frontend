import axiosInstance from "@/shared/lib/apiClient";
import { ListAllPaymentsResponse } from "../../types/registerPayment/registerPaymentTypes";

export async function getInscriptionsInAnalisis(
  eventId: string,
  page: number,
  pageSize: number
): Promise<ListAllPaymentsResponse> {
  try {
    const { data } = await axiosInstance.get<ListAllPaymentsResponse>(
      `payments/${eventId}/list`,
      {
        params: {
          page,
          pageSize,
        },
      }
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
        "Não foi possível carregar os membros."
    );
  }
}
