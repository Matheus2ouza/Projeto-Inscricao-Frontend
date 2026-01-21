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
    console.error("Error fetching type inscriptions:", error);
    throw new Error("Falha ao carregar tipos de inscrição");
  }
}
