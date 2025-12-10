import axiosInstance from "@/shared/lib/apiClient";
import { ListAvulsaRequest, ListAvulsaResponse } from "../types/avulsaTypes";

export async function getAvulsaRegistrations(
  params: ListAvulsaRequest
): Promise<ListAvulsaResponse> {
  const { eventId, page = "1", pageSize = "15" } = params;
  try {
    const { data } = await axiosInstance.get<ListAvulsaResponse>(
      `inscriptions/avul/${eventId}`,
      { params: { page, pageSize } }
    );
    return {
      ...data,
      totals: data.totals ?? {
        totalDinheiro: 0,
        totalCartao: 0,
        totalPix: 0,
        totalGeral: 0,
      },
    };
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao carregar inscrições avulsas"
    );
  }
}
