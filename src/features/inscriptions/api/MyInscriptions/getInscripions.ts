import { MyInscriptionsResponse } from "@/features/inscriptions/types/MyInscriptions/myInscriptionsTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getMyInscriptions(
  eventId: string,
  page: number = 0,
  pageSize: number = 10,
  limitTime?: string
): Promise<MyInscriptionsResponse> {
  try {
    const { data } = await axiosInstance.get<MyInscriptionsResponse>(
      `/inscriptions/${eventId}`,
      {
        params: {
          page,
          pageSize,
          limitTime,
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
        "Não foi possível buscar as inscrições."
    );
  }
}
