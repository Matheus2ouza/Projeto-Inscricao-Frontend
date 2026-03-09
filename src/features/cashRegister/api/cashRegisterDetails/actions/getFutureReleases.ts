import {
  FutureReleasesParams,
  GetFutureReleasesResponse,
} from "@/features/cashRegister/types/cashRegisterDetails/actions/futureReleasesTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getFutureReleases({
  cashRegisterId,
}: FutureReleasesParams): Promise<GetFutureReleasesResponse> {
  try {
    const { data } = await axiosInstance.get<GetFutureReleasesResponse>(
      `/cash-register/${cashRegisterId}/future-releases`,
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
        "Não foi possível carregar os membros.",
    );
  }
}
