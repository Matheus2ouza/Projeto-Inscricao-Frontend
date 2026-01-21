import axiosInstance from "@/shared/lib/apiClient";

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await axiosInstance.delete(`/events/${eventId}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao tentar deletar o evento"
    );
  }
}
