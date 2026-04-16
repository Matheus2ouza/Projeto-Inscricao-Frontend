import axiosInstance from "@/shared/lib/apiClient";
import { ListReceiptsResponse } from "../../types/list-receipts/listReceipts";

export async function getListReceipts(
  eventId: string,
  page: number,
  pageSize: number,
): Promise<ListReceiptsResponse> {
  try {
    const { data } = await axiosInstance.get<ListReceiptsResponse>(
      `/payments/${eventId}/receipts`,
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
