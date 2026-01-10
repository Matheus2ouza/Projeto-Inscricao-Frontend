import axiosInstance from "@/shared/lib/apiClient";
import { FindAllToMembersResponse } from "../types/membersType";

export async function getMembers(
  page: number,
  pageSize: number
): Promise<FindAllToMembersResponse> {
  try {
    const { data } = await axiosInstance.get<FindAllToMembersResponse>(
      `/members`,
      {
        params: {
          page,
          pageSize,
        },
      }
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
        "Não foi possível carregar os membros."
    );
  }
}
