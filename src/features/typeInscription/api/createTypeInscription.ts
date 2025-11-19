import axiosInstance from "@/shared/lib/apiClient";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

export type CreateTypeInscriptionInput = {
  description: string;
  value: number;
  eventId: string;
  specialType: boolean;
};

export async function createTypeInscription(
  input: CreateTypeInscriptionInput
): Promise<TypeInscriptions> {
  try {
    const response = await axiosInstance.post<TypeInscriptions>(
      "/type-inscription/create",
      input
    );
    return response.data;
  } catch (error) {
    console.error("Error creating type inscription:", error);
    throw new Error("Falha ao criar tipo de inscrição");
  }
}
