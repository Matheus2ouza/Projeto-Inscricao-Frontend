import {
  getListInscriptionsParams,
  ListInscriptionsResponse,
} from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export async function getListInscriptions({
  eventId,
  status,
  isGuest,
  orderBy,
  limitTime,
  page,
  pageSize,
  responsible,
}: getListInscriptionsParams): Promise<ListInscriptionsResponse> {
  try {
    const { data } = await axiosInstance.get<ListInscriptionsResponse>(
      `/inscriptions/${eventId}`,
      {
        params: {
          status,
          isGuest,
          orderBy,
          limitTime,
          responsible,
          page,
          pageSize,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
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
