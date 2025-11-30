"use server";

import axiosInstance from "@/shared/lib/apiClient";

export type StatusEvent = "OPEN" | "CLOSE" | "FINALIZED";

export type CreateEventResponsible = {
  accountId: string;
};

export type CreateEventRequest = {
  name: string;
  startDate: Date;
  endDate: Date;
  regionId: string;
  image?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
  status: StatusEvent;
  paymentEnabled: boolean;
  responsibles: CreateEventResponsible[];
};

export type RegisterEventOutput = {
  id: string;
};

export async function registerEvent(
  input: CreateEventRequest
): Promise<RegisterEventOutput> {
  try {
    const response = await axiosInstance.post("/events/create", input);
    const { data } = response;

    return { id: data.id };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error(
      "Erro ao registrar evento:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error(
      axiosError.response?.data?.message ||
      "Erro inesperado. Por favor, tente novamente mais tarde."
    );
  }
}
