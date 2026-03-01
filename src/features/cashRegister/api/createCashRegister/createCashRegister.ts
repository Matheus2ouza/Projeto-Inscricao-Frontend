import axiosInstance from "@/shared/lib/apiClient";
import {
  CreateCashInput,
  CreateCashResponse,
} from "../../types/createCashRegister/createCashRegisterTypes";

export async function createCashRegister({
  name,
  regionId,
  status,
  balance,
  allocationEvent,
}: CreateCashInput): Promise<CreateCashResponse> {
  try {
    const { data } = await axiosInstance.post(`cash-register`, {
      name,
      regionId,
      status,
      balance,
      allocationEvent,
    });
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
