import { ListInscriptionsResponse } from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getListInscriptions(
  eventId: string,
  page: number,
  pageSize: number,
  isGuest?: boolean,
  orderBy?: "asc" | "desc",
): Promise<ListInscriptionsResponse> {
  try {
    const { data } = await axiosInstance.get<ListInscriptionsResponse>(
      `/inscriptions/${eventId}`,
      {
        params: {
          page,
          pageSize,
          isGuest,
          orderBy,
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
        "Não foi possível buscar as inscrições.",
    );
  }
}
