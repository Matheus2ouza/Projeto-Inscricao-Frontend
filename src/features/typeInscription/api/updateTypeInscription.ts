import axiosInstance from "@/shared/lib/apiClient";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

export type UpdateTypeInscriptionInput = {
  description?: string;
  value?: number;
  specialType?: boolean;
  ruleDate?: Date | null;
};

export async function updateTypeInscription(
  typeInscriptionId: string,
  input: UpdateTypeInscriptionInput,
): Promise<TypeInscriptions> {
  try {
    console.log(input);
    const response = await axiosInstance.put<TypeInscriptions>(
      `/type-inscription/${typeInscriptionId}/update`,
      input,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Não foi possível carregar os pagamentos",
    );
  }
}
