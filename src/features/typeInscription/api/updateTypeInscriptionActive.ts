import axiosInstance from "@/shared/lib/apiClient";

export type UpdateTypeInscriptionActiveResponse = {
  id: string;
  active: boolean;
};

export async function updateTypeInscriptionActive(
  typeInscriptionId: string,
  active: boolean,
): Promise<UpdateTypeInscriptionActiveResponse> {
  try {
    const { data } =
      await axiosInstance.patch<UpdateTypeInscriptionActiveResponse>(
        `/type-inscription/${typeInscriptionId}/active`,
        {},
        {
          params: { active },
        },
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
        "Não foi possível desabilitar o tipo de inscrição",
    );
  }
}
