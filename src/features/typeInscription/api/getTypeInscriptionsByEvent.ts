import axiosInstance from "@/shared/lib/apiClient";
import { getTypeInscriptionsByEventResponse } from "../types/typesInscriptionsTypes";

export async function getTypeInscriptionsByEvent(
  eventId: string,
): Promise<getTypeInscriptionsByEventResponse> {
  try {
    const { data } =
      await axiosInstance.get<getTypeInscriptionsByEventResponse>(
        `/type-inscription/event/${eventId}`,
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
        "Não foi possível carregar os tipos de inscrição",
    );
  }
}
