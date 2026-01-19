import { MemberResponse } from "@/features/members/types/combobox/membertsComboboxType";
import axiosInstance from "@/shared/lib/apiClient";

export async function getMembersCombobox(
  eventId: string
): Promise<MemberResponse[]> {
  const { data } = await axiosInstance.get<MemberResponse[]>(
    `/members/${eventId}/all/names`
  );
  return data;
}
