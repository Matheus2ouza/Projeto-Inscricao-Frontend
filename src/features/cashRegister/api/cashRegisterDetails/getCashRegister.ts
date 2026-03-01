import axiosInstance from "@/shared/lib/apiClient";
import { GetCashRegisterResponse } from "../../types/cashRegisterDetails/cashRegisterDetailsType";

export async function getCashRegister(
  cashRegisetrId: string,
): Promise<GetCashRegisterResponse> {
  try {
    const { data } = await axiosInstance.get<GetCashRegisterResponse>(
      `cash-register/${cashRegisetrId}`,
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
