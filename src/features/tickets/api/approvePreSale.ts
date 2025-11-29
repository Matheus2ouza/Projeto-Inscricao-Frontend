import axiosInstance from "@/shared/lib/apiClient";

export type ApprovePreSalePayload = {
  ticketSalesId: string;
};

export async function approvePreSale(payload: ApprovePreSalePayload) {
  try {
    const { ticketSalesId } = payload;
    const { data } = await axiosInstance.post(
      `tickets/${ticketSalesId}/approve`,
      {
        ticketSalesId,
      }
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao aprovar a pré-venda."
    );
  }
}
