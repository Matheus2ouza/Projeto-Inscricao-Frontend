import { MemberResponse } from "@/features/members/types/combobox/membertsComboboxType";
import axiosInstance from "@/shared/lib/apiClient";

export async function getMembersCombobox(): Promise<MemberResponse[]> {
  const { data } =
    await axiosInstance.get<MemberResponse[]>("/members/all/names");
  return data;
}
