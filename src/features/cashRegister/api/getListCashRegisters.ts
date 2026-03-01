import axiosInstance from "@/shared/lib/apiClient";
import { listCashRegistersResponse } from "../types/listCashRegisters";

export async function getListCashRegisters(): Promise<listCashRegistersResponse> {
  try {
    const { data } =
      await axiosInstance.get<listCashRegistersResponse>(`cash-register`);
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
