import axiosInstance from "@/shared/lib/apiClient";

export async function deleteLogoEvent(eventId: string) {
  try {
    await axiosInstance.delete(`/events/${eventId}/delete/logo`);
  } catch (error) {
    console.error("Error deleting logo event:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao tentar deletar o logo do evento"
    );
  }
}
