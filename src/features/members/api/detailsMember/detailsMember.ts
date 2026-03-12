import axiosInstance from "@/shared/lib/apiClient";
import { getDetailsMemberResponse } from "../../types/detailsMember/detailsMemberType";

export async function getDetailsMember(memberId: string) {
  try {
    const { data } = await axiosInstance.get<getDetailsMemberResponse>(
      `/members/${memberId}`,
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
        "Não foi possível carregar os detalhes do membro.",
    );
  }
}
