import axiosInstance from "@/shared/lib/apiClient";
import {
  InscriptionAnalysisRequest,
  InscriptionAnalysisResponse,
} from "../../types/analysis/analysisTypes";

export async function getEventInscriptions(
  eventId: string,
  params: InscriptionAnalysisRequest,
): Promise<InscriptionAnalysisResponse> {
  try {
    const { data } = await axiosInstance.get<InscriptionAnalysisResponse>(
      `/events/${eventId}/analysis/inscription`,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      },
    );
    return data;
  } catch (error) {
    console.error("Error fetching event inscriptions analysis:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar análise de inscrições do evento",
    );
  }
}
