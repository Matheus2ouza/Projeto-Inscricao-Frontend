import axiosInstance from "@/shared/lib/apiClient";
import {
  generatePdfParams,
  generatePdfResponse,
} from "../../../types/cashRegisterDetails/actions/generatePdfTypes";

export async function generatePdf({
  cashRegisetrId,
}: generatePdfParams): Promise<generatePdfResponse> {
  try {
    const { data } = await axiosInstance.get<generatePdfResponse>(
      `cash-register/${cashRegisetrId}/pdf`,
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
