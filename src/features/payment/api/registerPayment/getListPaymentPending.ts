import axiosInstance from "@/shared/lib/apiClient";
import { ListAllPaymentsPendingResponse } from "../../types/registerPayment/registerPaymentTypes";

export async function getListPaymentPending(
  eventId: string,
  page: number,
  pageSize: number
): Promise<ListAllPaymentsPendingResponse> {
  try {
    const { data } = await axiosInstance.get<ListAllPaymentsPendingResponse>(
      `payments/${eventId}/list/pending`,
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
