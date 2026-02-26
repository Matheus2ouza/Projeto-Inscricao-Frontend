import {
  InscriptionStatus,
  ListInscriptionsResponse,
} from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export type getListInscriptionsParams = {
  eventId: string;
  status?: InscriptionStatus[];
  isGuest?: boolean;
  orderBy?: "asc" | "desc";
  limitTime?: string;
  page: number;
  pageSize: number;
};

export async function getListInscriptions({
  eventId,
  status,
  isGuest,
  orderBy,
  limitTime,
  page,
  pageSize,
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
