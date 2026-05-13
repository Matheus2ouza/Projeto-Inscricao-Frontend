import axiosInstance from "@/shared/lib/apiClient";
import {
  RegisterGuestInscriptionInput,
  RegisterGuestInscriptionResponse,
} from "../../types/guestInscription/guestInscriptionTypes";

export async function registerGuest(
  payload: RegisterGuestInscriptionInput,
): Promise<RegisterGuestInscriptionResponse> {
  try {
    const { data } = await axiosInstance.post<RegisterGuestInscriptionResponse>(
      `inscription/guest/register`,
      payload,
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
        "Não foi possível realizar a inscrição.",
    );
  }
}
