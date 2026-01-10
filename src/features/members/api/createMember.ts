import axiosInstance from "@/shared/lib/apiClient";

type CreateMemberRequest = {
  name: string;
  birthDate: string;
  gender: string;
};

type CreateMemberResponse = {
  id: string;
};

export async function createMember(
  input: CreateMemberRequest
): Promise<CreateMemberResponse> {
  try {
    const { data } = await axiosInstance.post<CreateMemberResponse>(
      "/members/create",
      input
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
        "Não foi possível criar o membro."
    );
  }
}
