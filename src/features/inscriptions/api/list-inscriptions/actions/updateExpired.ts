import {
  UpdateExpiredParams,
  UpdateExpiredResponse,
} from "@/features/inscriptions/types/list-inscriptions/actions/updateExpiredTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function updateExpired({
  inscriptionId,
  expiresAt,
}: UpdateExpiredParams): Promise<UpdateExpiredResponse> {
  try {
    const { data } = await axiosInstance.patch<UpdateExpiredResponse>(
      `/inscriptions/${inscriptionId}/expires`,
      {},
      {
        params: {
          expiresAt,
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
        "Não foi possível buscar os detalhes da inscrição.",
    );
  }
}
