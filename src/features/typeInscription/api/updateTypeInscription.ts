import axiosInstance from "@/shared/lib/apiClient";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

export type UpdateTypeInscriptionInput = {
  description?: string;
  value?: number;
  specialtype?: boolean;
};

export async function updateTypeInscription(
  typeInscriptionId: string,
  input: UpdateTypeInscriptionInput
): Promise<TypeInscriptions> {
  try {
    console.log(input)
    const response = await axiosInstance.put<TypeInscriptions>(
      `/type-inscription/${typeInscriptionId}/update`,
      input
    );
    return response.data;
  } catch (error) {
    console.error("Error updating type inscription:", error);
    throw new Error("Falha ao atualizar tipo de inscrição");
  }
}
