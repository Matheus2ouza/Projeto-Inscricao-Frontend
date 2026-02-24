import axiosInstance from "@/shared/lib/apiClient";

export type FindEventDateResponse = {
  events: {
    id: string;
    name: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
  }[];
};

export async function getEventsDates(): Promise<FindEventDateResponse> {
  try {
    const { data } =
      await axiosInstance.get<FindEventDateResponse>(`events/dates`);

    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Não foi possível carregar as datas dos eventos.",
    );
  }
}
