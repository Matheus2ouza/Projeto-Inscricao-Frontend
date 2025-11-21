"use client";

import { genaratePdfReport } from "@/features/report/api/genaratePdfReport";
import ReportDetails from "@/features/report/components/ReportDetails";
import { useReportGeneral } from "@/features/report/hooks/useReportGeneral";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const normalizeErrorMessage = (error: unknown): string | null =>
  error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : null;
export default function ReportDetalheSuperPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = useMemo(() => {
    const raw = params.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.id]);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, loading, isFetching, error, refetch } =
    useReportGeneral(eventId);

  const downloadReport = useCallback(async () => {
    if (!eventId) return;
    setIsDownloading(true);
    try {
      const { pdfBase64, filename } = await genaratePdfReport({ eventId });
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível baixar o relatório.";
      toast.error("Erro ao baixar relatório", { description: message });
    } finally {
      setIsDownloading(false);
    }
  }, [eventId]);

  const errorMessage = normalizeErrorMessage(error);

  if (!eventId) return null;

  return (
    <PageContainer
      title="Relatório Geral"
      description="Dados consolidados do evento selecionado."
      showBackButton
      backButtonAction={() => router.push("/super/report")}
    >
      <ReportDetails
        data={data}
        loading={loading}
        isFetching={isFetching}
        error={errorMessage}
        eventId={eventId}
        listPath="/super/report"
        isDownloading={isDownloading}
        onDownload={downloadReport}
        onRefresh={() => {
          void refetch();
        }}
      />
    </PageContainer>
  );
}
