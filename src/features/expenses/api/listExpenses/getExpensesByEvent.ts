import axiosInstance from "@/shared/lib/apiClient";
import {
  FindAllPaginatedEventExpensesRequest,
  FindAllPaginatedEventExpensesResponse,
} from "../types/expensesTypes";

export async function getExpensesByEvent(
  eventId: string,
  params: FindAllPaginatedEventExpensesRequest = {}
): Promise<FindAllPaginatedEventExpensesResponse> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.append("page", params.page);
    }

    if (params.pageSize) {
      searchParams.append("pageSize", params.pageSize);
    }

    const queryString = searchParams.toString();
    const url = `/event-expenses/${eventId}${queryString ? `?${queryString}` : ""}`;

    const { data } =
      await axiosInstance.get<FindAllPaginatedEventExpensesResponse>(url);
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message || "Falha ao carregar gastos do evento"
    );
  }
}
