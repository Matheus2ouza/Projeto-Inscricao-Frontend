import { ListInscriptionsPdfResponse } from "@/features/inscriptions/types/list-inscriptions/pdf/listInscriptionsPdfTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function listInscriptionsPdf(
  eventId: string,
  details: boolean,
  participants: boolean,
  isGuest?: boolean,
): Promise<ListInscriptionsPdfResponse> {
  try {
    const { data } = await axiosInstance.get<ListInscriptionsPdfResponse>(
      `/inscriptions/${eventId}/all/pdf`,
      {
        params: {
          isGuest,
          details,
          participants,
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
