import axiosInstance from "@/shared/lib/apiClient";
import {
  PaymentsList,
  PaymentsListResponse,
} from "../types/listPayments.types";

type PaymentsListApiResponse = {
  paymentsInscriptions: PaymentsList;
  total: number;
  page: number;
  pageCount: number;
};

export async function getPaymentsList(
  eventId: string,
  page: number,
  pageSize: number
): Promise<PaymentsListResponse> {
  try {
    const { data } = await axiosInstance.get<PaymentsListApiResponse>(
      `/payments/${eventId}/list`,
      {
        params: {
          page,
          pageSize,
        },
      }
    );

    return {
      payments: data.paymentsInscriptions,
      total: data.total,
      page: data.page,
      pageCount: data.pageCount,
    };

  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Não foi possível carregar os pagamentos"
    );
  }
}
