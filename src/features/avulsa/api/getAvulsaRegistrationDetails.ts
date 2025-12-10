import axiosInstance from "@/shared/lib/apiClient";
import {
  AvulsaRegistrationDetails,
  GetAvulsaRegistrationDetailsRequest,
} from "../types/avulsaTypes";

export async function getAvulsaRegistrationDetails({
  registrationId,
}: GetAvulsaRegistrationDetailsRequest): Promise<AvulsaRegistrationDetails> {
  try {
    const { data } = await axiosInstance.get<AvulsaRegistrationDetails>(
      `inscriptions/avul/${registrationId}/details`
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao carregar detalhes da inscrição avulsa"
    );
  }
}
