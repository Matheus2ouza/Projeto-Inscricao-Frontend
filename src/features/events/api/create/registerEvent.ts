"use server";

import axiosInstance from "@/shared/lib/apiClient";
import { CreateEventRequest, RegisterEventResponse } from "../../types/create/createEvent";

export async function registerEvent(
  data: CreateEventRequest
): Promise<RegisterEventResponse> {
  try {
    const response = await axiosInstance.post("/events/create", data);

    return { id: response.data.id };
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
