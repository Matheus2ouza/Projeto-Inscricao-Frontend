import axiosInstance from "@/shared/lib/apiClient";

export type FindPaymentsDateResponse = {
  eventId: string;
  paymentId: string;
  installmentNumber: number;
  received: boolean;
  value: number;
  netValue: number;
  estimatedAt: Date;
}[];

export async function getPaymentsDates(): Promise<FindPaymentsDateResponse> {
  try {
    const { data } =
      await axiosInstance.get<FindPaymentsDateResponse>(`payments/dates`);

    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Não foi possível carregar as datas dos pagamentos.",
    );
  }
}
