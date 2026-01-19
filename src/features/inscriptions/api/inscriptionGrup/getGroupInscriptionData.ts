import axiosInstance from "@/shared/lib/apiClient";

export interface GroupInscriptionDataResponse {
  cacheKey: string;
  total: number;
  unitValue: number;
  items: Array<{
    name: string;
    birthDate: string;
    gender: string;
    typeDescription: string;
    value: number;
  }>;
}

export async function getGroupInscriptionData(
  cacheKey: string
): Promise<GroupInscriptionDataResponse> {
  const response = await axiosInstance.get(
    `inscriptions/group/confirmation/${encodeURIComponent(cacheKey)}`
  );
  return response.data;
}
