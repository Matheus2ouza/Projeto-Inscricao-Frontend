import axiosInstance from "@/shared/lib/apiClient";
import { TypeInscription } from "../types/individualInscriptionTypes";

export const getTypeInscriptions = async (
  eventId: string
): Promise<TypeInscription[]> => {
  const response = await axiosInstance.get(
    `/type-inscription/event/${eventId}`
  );
  return response.data;
};
