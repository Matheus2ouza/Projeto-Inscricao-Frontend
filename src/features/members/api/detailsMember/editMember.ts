import axiosInstance from "@/shared/lib/apiClient";
import {
  EditMemberData,
  EditMemberResponse,
} from "../../types/detailsMember/editMemberType";

export async function editMember(memberId: string, member: EditMemberData) {
  try {
    const { data } = await axiosInstance.put<EditMemberResponse>(
      `/members/${memberId}`,
      {
        name: member.name,
        preferredName: member.preferredName,
        cpf: member.cpf,
        birthDate: member.birthDate,
        gender: member.gender,
        shirtSize: member.shirtSize,
        shirtType: member.shirtType,
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
        "Não foi possível carregar os detalhes do membro.",
    );
  }
}
