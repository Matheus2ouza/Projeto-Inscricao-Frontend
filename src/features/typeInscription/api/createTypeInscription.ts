import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

export type CreateTypeInscriptionInput = {
  description: string;
  value: number;
  rule: Date | null;
  eventId: string;
  specialType: boolean;
};

export async function createTypeInscription(
  input: CreateTypeInscriptionInput,
): Promise<TypeInscriptions> {
  try {
    const response = await axiosInstance.post<TypeInscriptions>(
      `/type-inscription/${input.eventId}/create`,
      input,
      {
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
      },
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
