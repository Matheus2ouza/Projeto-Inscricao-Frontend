import { GetMembersResponse } from "@/features/members/types/combobox/membersComboboxType";
import axiosInstance from "@/shared/lib/apiClient";

export async function getMembersCombobox(
  eventId: string,
  accountId?: string,
): Promise<GetMembersResponse> {
  try {
    const { data } = await axiosInstance.get<GetMembersResponse>(
      `/members/${eventId}/all-names`,
      { params: { accountId } },
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
        "Não foi possível buscar os dados dos membros",
    );
  }
}
