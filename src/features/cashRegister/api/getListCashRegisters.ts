import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import {
  CashRegisterStatus,
  ListCashRegistersResponse,
} from "../types/listCashRegisters";

export async function getListCashRegisters(
  status?: CashRegisterStatus[],
  page?: number,
  pageSize?: number,
): Promise<ListCashRegistersResponse> {
  try {
    const { data } = await axiosInstance.get<ListCashRegistersResponse>(
      `cash-register`,
      {
        params: {
          status,
          page,
          pageSize,
        },
        paramsSerializer: (params) => qs.stringify(params, { indices: false }),
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
        "Não foi possível carregar os membros.",
    );
  }
}
