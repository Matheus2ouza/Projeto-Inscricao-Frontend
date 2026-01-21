import axiosInstance from "@/shared/lib/apiClient";

export async function deleteImageEvent(eventId: string) {
  try {
    await axiosInstance.delete(`/events/${eventId}/delete/image`);
  } catch (error) {
    console.error("Error deleting image event:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao tentar deletar a imagem do evento"
    );
  }
}
